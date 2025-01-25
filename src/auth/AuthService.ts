import { Result } from '../common/result/result.type'
import { ResultStatus } from '../common/result/resultCode'
import { bcryptService } from '../common/adapters/bcrypt.service'
import { usersRepository } from '../users/UsersRepository'
import { jwtService } from '../common/adapters/jwt.service'
import { UserDBType, UserRegInsertDBType } from './types/types'
import { randomUUID } from 'node:crypto'
import { add } from 'date-fns/add'
import { emailManager } from '../email/EmailManager'

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
        errorMessage: 'User not found',
        extensions: [{ field: 'email', message: 'User not found' }],
      }
    }

    if (user.emailConfirmation.isConfirmed) {
      return {
        status: ResultStatus.NotFound,
        data: false,
        errorMessage: 'email already confirmed',
        extensions: [{ field: 'email', message: 'email already confirmed' }],
      }
    }

    const newConfirmationCode = randomUUID()
    const newExpirationDate = add(new Date(), { hours: 1 })

    const isUpdated = await usersRepository.updateConfirmationCode(user._id, {
      confirmationCode: newConfirmationCode,
      expirationDate: newExpirationDate,
      isConfirmed: false,
    })

    if (!isUpdated)
      return {
        status: ResultStatus.ServerError,
        data: false,
        errorMessage: 'Failed to update confirmation code',
        extensions: [{ field: 'email', message: 'Failed to update confirmation code' }],
      }

    await emailManager.sendEmailConfirmationMessage({
      ...user,
      emailConfirmation: {
        confirmationCode: newConfirmationCode,
        expirationDate: newExpirationDate,
        isConfirmed: false,
      },
    })

    console.log(`New confirmation code sent to email: ${email}`)
    return {
      status: ResultStatus.Success,
      data: true,
      extensions: [],
    }
  },

  async loginUser(
    loginOrEmail: string,
    password: string,
  ): Promise<Result<{ accessToken: string | null }>> {
    const result = await this.checkUserCredentials(loginOrEmail, password)

    if (result.status !== ResultStatus.Success) {
      return {
        status: ResultStatus.Unauthorized,
        errorMessage: 'Unauthorized',
        extensions: [{ field: 'loginOrEmail', message: 'Wrong credentials' }],
        data: null,
      }
    }
    debugger
    const accessToken = await jwtService.createToken(result.data!._id.toString())

    return {
      status: ResultStatus.Success,
      data: { accessToken },
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
        status: ResultStatus.NotFound,
        data: null,
        errorMessage: 'Not Found',
        extensions: [{ field: 'loginOrEmail', message: 'Not Found' }],
      }

    if (!user.emailConfirmation.isConfirmed) {
      return {
        status: ResultStatus.Forbidden,
        data: null,
        errorMessage: 'Forbidden',
        extensions: [{ field: 'email', message: 'Email not confirmed' }],
      }
    }

    const isPassCorrect = await bcryptService.checkPassword(password, user.passwordHash)
    if (!isPassCorrect)
      return {
        status: ResultStatus.BadRequest,
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
