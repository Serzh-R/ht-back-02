import { FieldErrorType, UserDBInsertType, UserInputType } from '../types/types'
import bcrypt from 'bcrypt'
import { usersRepository } from './UsersRepository'
import { ObjectId } from 'mongodb'

export const usersService = {
  async hashPassword(password: string): Promise<{ passwordHash: string; passwordSalt: string }> {
    const passwordSalt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, passwordSalt)
    return { passwordHash, passwordSalt }
  },

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

    const { passwordHash, passwordSalt } = await this.hashPassword(body.password)

    const userDB: UserDBInsertType = {
      login: body.login,
      email: body.email,
      passwordSalt,
      passwordHash,
      createdAt: new Date().toISOString(),
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
    return await bcrypt.compare(password, user.passwordHash)
  },

  async deleteUser(id: string): Promise<boolean> {
    return await usersRepository.deleteUser(id)
  },
}
