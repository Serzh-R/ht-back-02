import { Result } from '../common/result/result.type'
import { ResultStatus } from '../common/result/resultCode'
import { bcryptService } from '../common/adapters/bcrypt.service'
import { usersRepository } from '../users/UsersRepository'
import { jwtService } from '../common/adapters/jwt.service'
import { UserDBType, UserRegInsertDBType } from './types/types'
import { randomUUID } from 'node:crypto'
import { add } from 'date-fns/add'
import { emailManager } from '../managers/EmailManager'

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

  async registerConfirm(code: string): Promise<boolean> {
    let user = await usersRepository.findUserByConfirmationCode(code)
    if (!user) {
      return false
    }
    if (
      user.emailConfirmation.confirmationCode === code &&
      user.emailConfirmation.expirationDate > new Date()
    ) {
      let result = await usersRepository.updateConfirmation(user._id)
      return result
    }
    return false
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

  /*async registerUser(
    login: string,
    pass: string,
    email: string,
  ): Promise<UserRegisterDBType | null> {
    const user = await usersRepository.findByLoginOrEmail(login)
    if (user) return null
    //проверить существует ли уже юзер с таким логином или почтой и если да - не регистрировать

    const passwordHash = await bcryptService.generateHash(pass)

    const newUser: UserRegisterDBType = {
      // сформировать dto юзера
      login,
      email,
      passwordHash,
      createdAt: new Date(),
      emailConfirmation: {
        // доп поля необходимые для подтверждения
        confirmationCode: randomUUID(),
        expirationDate: add(new Date(), {
          hours: 1,
          minutes: 30,
        }),
        isConfirmed: false,
      },
    }
    await usersRepository.createUser(newUser)

    //отправку сообщения лучше обернуть в try-catch, чтобы при ошибке(например отвалиться отправка) приложение не падало
    try {
      await emailService.sendEmail(
        //отправить сообщение на почту юзера с кодом подтверждения
        newUser.email,
        newUser.emailConfirmation.confirmationCode,
        emailExamples.registrationEmail,
      )
    } catch (e: unknown) {
      console.error('Send email error', e) //залогировать ошибку при отправке сообщения
    }
    return newUser
  },*/
}
