import { FieldErrorType, UserDBInsertType, UserInputType } from '../types/types'
import { usersRepository } from './UsersRepository'
import { ObjectId } from 'mongodb'
import { bcryptService } from '../common/adapters/bcrypt-service'

export const usersService = {
  async createUser(
    body: UserInputType,
  ): Promise<{ userId: ObjectId | null; errorsMessages: FieldErrorType[] }> {
    const userByLogin = await usersRepository.findByLoginOrEmail(body.login)
    if (userByLogin) {
      return {
        userId: null,
        errorsMessages: [
          {
            field: 'login',
            message: 'login should be unique',
          },
        ],
      }
    }

    const userByEmail = await usersRepository.findByLoginOrEmail(body.email)
    if (userByEmail) {
      return {
        userId: null,
        errorsMessages: [
          {
            field: 'email',
            message: 'email should be unique',
          },
        ],
      }
    }

    const { passwordHash, passwordSalt } = await bcryptService.generateHash(body.password)

    const userDB: UserDBInsertType = {
      login: body.login,
      email: body.email,
      passwordSalt,
      passwordHash,
      createdAt: new Date(),
    }

    const userId = await usersRepository.createUser(userDB)

    return {
      userId,
      errorsMessages: [],
    }
  },

  async checkCredentials(loginOrEmail: string, password: string): Promise<boolean> {
    const user = await usersRepository.findByLoginOrEmail(loginOrEmail)
    if (!user) return false
    return await bcryptService.checkPassword(password, user.passwordHash)
  },

  async deleteUser(id: string): Promise<boolean> {
    return await usersRepository.deleteUser(id)
  },
}
