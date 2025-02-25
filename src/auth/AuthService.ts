import { Result } from '../common/result/result.type'
import { ResultStatus } from '../common/result/resultCode'
import { bcryptService } from '../common/adapters/bcrypt.service'
import { usersRepository } from '../users/UsersRepository'
import { jwtService, RefreshTokenPayload } from '../common/adapters/jwt.service'
import { UserDBType, UserRegInsertDBType } from '../users/user-types'
import { randomUUID } from 'node:crypto'
import { add } from 'date-fns/add'
import { emailManager } from '../email/EmailManager'
import { deviceSessionsRepository } from '../devices/DeviceSessionsRepository'
import { REFRESH_TIME } from '../settings'
import { validateRefreshTokenAndSession } from '../common/helpers/validateRefreshTokenAndSession'

export const authService = {
  async registerUser(
    login: string,
    email: string,
    password: string,
  ): Promise<Result<{ userId: string } | null>> {
    const passwordHash = await bcryptService.generateHash(password)
    const user: UserRegInsertDBType = {
      login,
      email,
      passwordHash,
      createdAt: new Date(),
      emailConfirmation: {
        confirmationCode: randomUUID(),
        expirationDate: add(new Date(), { hours: 1 }),
        isConfirmed: false,
      },
    }
    const userId = await usersRepository.createUser(user)

    emailManager.sendEmailConfirmationMessage(user).catch(async (e: Error) => {
      console.error('Ошибка при отправке email:', e)

      const isDeleted = await usersRepository.deleteUser(userId.toString())
      if (!isDeleted) {
        console.error('Failed to delete user after email sending error')
      }
    })

    return {
      status: ResultStatus.Success,
      data: { userId: userId.toString() },
      extensions: [],
    }
  },

  async registerConfirm(code: string): Promise<Result<boolean>> {
    try {
      const user = await usersRepository.findUserByConfirmationCode(code)

      if (!user) {
        console.warn(`Confirmation code ${code} not found`)
        return {
          status: ResultStatus.NotFound,
          data: false,
          errorMessage: 'User not found',
          extensions: [{ field: 'code', message: 'Invalid confirmation code' }],
        }
      }

      if (user.emailConfirmation.confirmationCode !== code) {
        console.warn(`Confirmation code ${code} does not match`)
        return {
          status: ResultStatus.BadRequest,
          data: false,
          errorMessage: 'Invalid confirmation code',
          extensions: [{ field: 'code', message: 'Invalid confirmation code' }],
        }
      }

      if (user.emailConfirmation.expirationDate < new Date()) {
        const newConfirmationCode = randomUUID()
        const newExpirationDate = add(new Date(), { hours: 1 })

        const isUpdated = await usersRepository.updateConfirmationCode(user._id, {
          confirmationCode: newConfirmationCode,
          expirationDate: newExpirationDate,
          isConfirmed: false,
        })

        if (!isUpdated) {
          return {
            status: ResultStatus.ServerError,
            data: false,
            errorMessage: 'Failed to update confirmation code',
            extensions: [{ field: 'code', message: 'Failed to update confirmation code' }],
          }
        }

        await emailManager.sendEmailConfirmationMessage({
          ...user,
          emailConfirmation: {
            confirmationCode: newConfirmationCode,
            expirationDate: newExpirationDate,
            isConfirmed: false,
          },
        })

        console.log(`Confirmation code expired. New code sent to email: ${user.email}`)

        return {
          status: ResultStatus.BadRequest,
          data: false,
          errorMessage: 'Confirmation code expired',
          extensions: [{ field: 'code', message: 'Confirmation code expired' }],
        }
      }

      const result = await usersRepository.updateConfirmation(user._id)

      return {
        status: ResultStatus.Success,
        data: result,
        extensions: [],
      }
    } catch (error) {
      console.error('Error during registerConfirm:', error)
      return {
        status: ResultStatus.ServerError,
        data: false,
        errorMessage: 'Internal server error',
        extensions: [],
      }
    }
  },

  async registerEmailResending(email: string): Promise<Result<boolean>> {
    const user = await usersRepository.findByLoginOrEmail(email)

    if (!user) {
      return {
        status: ResultStatus.NotFound,
        data: false,
        errorMessage: 'User with this email does not exist',
        extensions: [{ field: 'email', message: 'User with this email does not exist' }],
      }
    }

    if (user.emailConfirmation.isConfirmed) {
      return {
        status: ResultStatus.BadRequest,
        data: false,
        errorMessage: 'Email already confirmed',
        extensions: [{ field: 'email', message: 'Email already confirmed' }],
      }
    }

    const newConfirmationCode = randomUUID()
    const newExpirationDate = add(new Date(), { hours: 1 })
    user.emailConfirmation.confirmationCode = newConfirmationCode
    const isUpdated = await usersRepository.updateConfirmationCode(user._id, {
      confirmationCode: newConfirmationCode,
      expirationDate: newExpirationDate,
      isConfirmed: false,
    })

    if (!isUpdated) {
      return {
        status: ResultStatus.ServerError,
        data: false,
        errorMessage: 'Failed to update confirmation code',
        extensions: [],
      }
    }

    const updatedUser = await usersRepository.findByLoginOrEmail(email)

    if (!updatedUser) {
      return {
        status: ResultStatus.ServerError,
        data: false,
        errorMessage: 'Failed to retrieve updated user',
        extensions: [],
      }
    }

    emailManager.sendEmailConfirmationMessage(updatedUser).catch((e: Error) => console.error(e))

    console.log(`New confirmation code sent to email: ${email}`)

    return {
      status: ResultStatus.Success,
      data: true,
      extensions: [],
    }
  },

  async login(
    loginOrEmail: string,
    password: string,
    userAgent: string | undefined,
    ip: string,
    deviceId: string,
  ): Promise<Result<{ accessToken: string; refreshToken: string }>> {
    const result = await this.checkUserCredentials(loginOrEmail, password)

    if (result.status !== ResultStatus.Success) {
      return {
        status: ResultStatus.Unauthorized,
        errorMessage: 'Unauthorized',
        extensions: [{ field: 'loginOrEmail', message: 'Wrong credentials' }],
        data: null,
      }
    }

    const title = userAgent || 'Unknown Device'

    const accessToken = await jwtService.createAccessToken(result.data!._id.toString())
    const refreshToken = await jwtService.createRefreshToken(result.data!._id.toString(), deviceId)

    const decodedRefreshToken = (await jwtService.decodeToken(
      refreshToken,
    )) as unknown as RefreshTokenPayload

    if (!decodedRefreshToken || !decodedRefreshToken.iat || !decodedRefreshToken.exp) {
      throw new Error('Invalid refresh token structure')
    }

    const lastActiveDate = decodedRefreshToken.iat! * 1000
    const expirationDate = decodedRefreshToken.exp! * 1000

    const isSessionCreated = await deviceSessionsRepository.createDeviceSession({
      ip,
      title,
      lastActiveDate,
      expirationDate,
      deviceId,
      userId: result.data!._id.toString(),
    })

    if (!isSessionCreated) {
      throw new Error('Failed to create device session')
    }

    return {
      status: ResultStatus.Success,
      data: { accessToken, refreshToken },
      extensions: [],
    }
  },

  async passwordRecovery(email: string): Promise<Result<boolean>> {
    const user = await usersRepository.findByLoginOrEmail(email)

    if (!user) {
      return {
        status: ResultStatus.Success,
        data: true,
        extensions: [],
      }
    }

    const recoveryCode = randomUUID()
    const expirationDate = add(new Date(), { hours: 1 })

    const updateSuccess = await usersRepository.updateConfirmationCode(user._id, {
      confirmationCode: recoveryCode,
      expirationDate,
      isConfirmed: false,
    })

    if (!updateSuccess) {
      return {
        status: ResultStatus.BadRequest,
        data: false,
        errorMessage: 'Failed to update recovery code',
        extensions: [{ field: 'inputModel', message: 'Failed to update recovery code' }],
      }
    }

    await emailManager.sendEmailPasswordRecovery(user)

    return {
      status: ResultStatus.Success,
      data: true,
      extensions: [],
    }
  },

  async newPassword(newPassword: string, recoveryCode: string): Promise<Result<boolean>> {
    const user = await usersRepository.findUserByConfirmationCode(recoveryCode)

    if (!user) {
      return {
        status: ResultStatus.BadRequest,
        data: false,
        errorMessage: 'Invalid recovery code',
        extensions: [{ field: 'recoveryCode', message: 'Invalid recovery code' }],
      }
    }

    if (new Date() > user.emailConfirmation.expirationDate) {
      return {
        status: ResultStatus.BadRequest,
        data: false,
        errorMessage: 'Recovery code expired',
        extensions: [{ field: 'recoveryCode', message: 'Invalid recovery code' }],
      }
    }

    const isPasswordCorrect = await bcryptService.checkPassword(newPassword, user.passwordHash)
    if (isPasswordCorrect) {
      return {
        status: ResultStatus.Unauthorized,
        data: false,
        errorMessage: 'You cannot use the old password',
        extensions: [{ field: 'password', message: 'Cannot use the old password' }],
      }
    }

    const passwordHash = await bcryptService.generateHash(newPassword)

    const isUpdated = await usersRepository.updatePassword(user._id, passwordHash)

    if (!isUpdated) {
      return {
        status: ResultStatus.BadRequest,
        data: false,
        errorMessage: 'Failed to update password',
        extensions: [{ field: 'password', message: 'Password update failed' }],
      }
    }

    return {
      status: ResultStatus.Success,
      data: true,
      extensions: [],
    }
  },

  async refreshToken(
    oldRefreshToken: string,
  ): Promise<Result<{ accessToken: string; refreshToken: string }>> {
    const validationResult = await validateRefreshTokenAndSession(oldRefreshToken)

    if (validationResult.status !== ResultStatus.Success) {
      return {
        status: validationResult.status,
        errorMessage: validationResult.errorMessage,
        data: null,
        extensions: validationResult.extensions,
      }
    }

    const { decoded } = validationResult.data!

    const newLastActiveDate = Math.floor(Date.now() / 1000)
    const newExpirationDate = newLastActiveDate + Number(REFRESH_TIME)

    const isUpdated = await deviceSessionsRepository.updateSessionDates(
      decoded.deviceId,
      decoded.userId,
      newLastActiveDate,
      newExpirationDate,
    )

    if (!isUpdated) {
      return {
        status: ResultStatus.Unauthorized,
        errorMessage: 'Failed to update session dates',
        data: null,
        extensions: [],
      }
    }

    const newAccessToken = await jwtService.createAccessToken(decoded.userId)
    const newRefreshToken = await jwtService.createRefreshToken(decoded.userId, decoded.deviceId)

    return {
      status: ResultStatus.Success,
      data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
      extensions: [],
    }
  },

  async logout(refreshToken: string): Promise<Result<null>> {
    const validationResult = await validateRefreshTokenAndSession(refreshToken)

    if (validationResult.status !== ResultStatus.Success) {
      return validationResult as Result<null> // Явно указываем, что возвращаем Result<null>
    }

    const { decoded } = validationResult.data!

    const sessionDeleted = await deviceSessionsRepository.deleteDeviceSessions({
      deviceId: decoded.deviceId,
      userId: decoded.userId,
    })

    if (!sessionDeleted) {
      return {
        status: ResultStatus.Unauthorized,
        errorMessage: 'Session not found',
        data: null,
        extensions: [{ field: 'deviceId', message: 'Session not found' }],
      }
    }

    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    }
  },

  async checkUserCredentials(
    loginOrEmail: string,
    password: string,
  ): Promise<Result<UserDBType | null>> {
    const user = await usersRepository.findByLoginOrEmail(loginOrEmail)
    if (!user) {
      return {
        status: ResultStatus.Unauthorized,
        data: null,
        errorMessage: 'Unauthorized',
        extensions: [{ field: 'loginOrEmail', message: 'Wrong credentials' }],
      }
    }

    if (!user.emailConfirmation.isConfirmed) {
      return {
        status: ResultStatus.Unauthorized,
        data: null,
        errorMessage: 'Unauthorized',
        extensions: [{ field: 'login', message: 'Invalid credentials or account not confirmed' }],
      }
    }

    const isPassCorrect = await bcryptService.checkPassword(password, user.passwordHash)
    if (!isPassCorrect) {
      return {
        status: ResultStatus.Unauthorized,
        data: null,
        errorMessage: 'Unauthorized',
        extensions: [{ field: 'password', message: 'Wrong password' }],
      }
    }

    return {
      status: ResultStatus.Success,
      data: user,
      extensions: [],
    }
  },
}
