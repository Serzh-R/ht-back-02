import { Result } from '../common/result/result.type'
import { ResultStatus } from '../common/result/resultCode'
import { bcryptService } from '../common/adapters/bcrypt.service'
import { usersRepository } from '../users/UsersRepository'
import { jwtService } from '../common/adapters/jwt.service'
import { UserDBType, UserRegInsertDBType } from './types/types'
import { randomUUID } from 'node:crypto'
import { add } from 'date-fns/add'
import { emailManager } from '../email/EmailManager'
import { blacklistRepository } from './BlacklistRepository'
import { REFRESH_TIME } from '../settings'
import { deviceSessionsCollection } from '../db/mongoDb'

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
    try {
      await emailManager.sendEmailConfirmationMessage(user)
    } catch (error) {
      console.error('Ошибка при отправке email:', error)

      const isDeleted = await usersRepository.deleteUser(userId.toString())
      if (!isDeleted) {
        console.error('Failed to delete user after email sending error')
      }

      return {
        status: ResultStatus.ServerError,
        data: null,
        errorMessage: 'Failed to send confirmation email',
        extensions: [{ field: 'email', message: 'Email sending failed' }],
      }
    }

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

    await emailManager.sendEmailConfirmationMessage(updatedUser)

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

    const accessToken = await jwtService.createAccessToken(result.data!._id.toString())
    const refreshToken = await jwtService.createRefreshToken(result.data!._id.toString(), deviceId)
    const expirationDate = new Date(Date.now() + Number(REFRESH_TIME) * 1000)
    const title = userAgent || 'Unknown Device'

    await deviceSessionsCollection.insertOne({
      ip,
      title,
      lastActiveDate: new Date(),
      expirationDate,
      deviceId,
      userId: result.data!._id.toString(),
    })

    return {
      status: ResultStatus.Success,
      data: { accessToken, refreshToken },
      extensions: [],
    }
  },

  async refreshToken(
    oldRefreshToken: string,
  ): Promise<Result<{ accessToken: string; refreshToken: string }>> {
    const isBlacklisted = await blacklistRepository.isTokenBlacklisted(oldRefreshToken)
    if (isBlacklisted) {
      return {
        status: ResultStatus.Unauthorized,
        errorMessage: 'Invalid refresh token (blacklisted)',
        data: null,
        extensions: [{ field: null, message: 'Refresh token is blacklisted' }],
      }
    }

    const decoded = await jwtService.verifyRefreshToken(oldRefreshToken)
    if (!decoded) {
      return {
        status: ResultStatus.Unauthorized,
        errorMessage: 'Invalid refresh token',
        data: null,
        extensions: [{ field: null, message: 'Invalid refresh token' }],
      }
    }

    const user = await usersRepository.findById(decoded.userId)
    if (!user) {
      return {
        status: ResultStatus.Unauthorized,
        errorMessage: 'User not found',
        data: null,
        extensions: [{ field: 'userId', message: 'User not found' }],
      }
    }

    const session = await deviceSessionsCollection.findOne({
      deviceId: decoded.deviceId,
      userId: decoded.userId,
    })

    if (!session) {
      return {
        status: ResultStatus.Unauthorized,
        errorMessage: 'Invalid device or session not found',
        data: null,
        extensions: [{ field: 'deviceId', message: 'Session not found' }],
      }
    }

    if (session.lastActiveDate.getTime() !== decoded.lastActiveDate.getTime()) {
      return {
        status: ResultStatus.Unauthorized,
        errorMessage: 'Invalid last active date',
        data: null,
        extensions: [{ field: 'lastActiveDate', message: 'Last active date mismatch' }],
      }
    }

    const newExpirationDate = new Date(Date.now() + Number(REFRESH_TIME) * 1000)
    await deviceSessionsCollection.updateOne(
      { deviceId: decoded.deviceId },
      { $set: { lastActiveDate: new Date(), expirationDate: newExpirationDate } },
    )

    const newAccessToken = await jwtService.createAccessToken(decoded.userId)
    const newRefreshToken = await jwtService.createRefreshToken(decoded.userId, decoded.deviceId)

    await blacklistRepository.addTokenToBlacklist(oldRefreshToken)

    await usersRepository.updateRefreshToken(decoded.userId, newRefreshToken)

    return {
      status: ResultStatus.Success,
      data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
      extensions: [],
    }
  },

  async logout(refreshToken: string): Promise<Result<null>> {
    if (!refreshToken) {
      return {
        status: ResultStatus.Unauthorized,
        errorMessage: 'No refresh token provided',
        data: null,
        extensions: [{ field: 'refreshToken', message: 'Refresh token is missing' }],
      }
    }

    const isBlacklisted = await blacklistRepository.isTokenBlacklisted(refreshToken)
    if (isBlacklisted) {
      return {
        status: ResultStatus.Unauthorized,
        errorMessage: 'Refresh token is invalid (blacklisted)',
        data: null,
        extensions: [{ field: 'refreshToken', message: 'Refresh token already used' }],
      }
    }

    // Проверяем, есть ли токен в базе (если используем хранение в `usersRepository`)
    const decoded = await jwtService.verifyRefreshToken(refreshToken)
    if (!decoded) {
      return {
        status: ResultStatus.Unauthorized,
        errorMessage: 'Invalid refresh token',
        data: null,
        extensions: [{ field: 'refreshToken', message: 'Refresh token is invalid' }],
      }
    }

    const user = await usersRepository.findById(decoded.userId)
    if (!user) {
      return {
        status: ResultStatus.Unauthorized,
        errorMessage: 'User not found',
        data: null,
        extensions: [{ field: 'userId', message: 'User not found' }],
      }
    }

    await blacklistRepository.addTokenToBlacklist(refreshToken)

    // Удаляем refresh-токен из базы (если храним его у пользователя)
    await usersRepository.updateRefreshToken(user._id.toString(), null)

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
    if (!user)
      return {
        status: ResultStatus.Unauthorized,
        data: null,
        errorMessage: 'Not Found',
        extensions: [{ field: 'loginOrEmail', message: 'Wrong credentials' }],
      }

    const isPassCorrect = await bcryptService.checkPassword(password, user.passwordHash)
    if (!isPassCorrect)
      return {
        status: ResultStatus.Unauthorized,
        data: null,
        errorMessage: 'Bad Request',
        extensions: [{ field: 'password', message: 'Wrong password' }],
      }

    return {
      status: ResultStatus.Success,
      data: user,
      extensions: [],
    }
  },
}
