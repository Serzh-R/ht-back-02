import { FieldErrorType, UserDBInsertType, UserInputType } from '../types/types'
import bcrypt from 'bcrypt'
import { usersRepository } from './UsersRepository'
import { ObjectId } from 'mongodb'

/*type UserCreatedType = {
  errorsMessages: FieldErrorType[] | null
  userId: string | null
}*/

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

    const passwordSalt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(body.password, passwordSalt)

    const userDB: UserDBInsertType = {
      login: body.login,
      email: body.email,
      passwordSalt: passwordSalt,
      passwordHash: passwordHash,
      createdAt: new Date().toISOString(),
    }

    const userId = await usersRepository.createUser(userDB)

    return {
      userId,
      errorsMessages: [],
    }
  },

  /*async createUser(body: UserInputType): Promise<UserCreatedType> {
    const existingUserByLogin = await usersRepository.findByLoginOrEmail(
      body.login,
    )
    if (existingUserByLogin) {
      return {
        errorsMessages: [
          {
            field: 'login',
            message: 'login should be unique',
          },
        ],
        userId: null,
      }
    }

    const existingUserByEmail = await usersRepository.findByLoginOrEmail(
      body.email,
    )
    if (existingUserByEmail) {
      return {
        errorsMessages: [
          {
            field: 'email',
            message: 'email should be unique',
          },
        ],
        userId: null,
      }
    }

    const passwordSalt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(body.password, passwordSalt)

    const newUser = {
      login: body.login,
      email: body.email,
      passwordSalt: passwordSalt,
      passwordHash: passwordHash,
      createdAt: new Date().toISOString(),
    }

    const userId = await usersRepository.createUser(newUser)
    return {
      errorsMessages: null,
      userId,
    }
  },*/

  async checkCredentials(
    loginOrEmail: string,
    password: string,
  ): Promise<boolean> {
    const user = await usersRepository.findByLoginOrEmail(loginOrEmail)
    if (!user) return false
    const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash)
    return isPasswordCorrect
  },

  async deleteUser(id: string): Promise<boolean> {
    return await usersRepository.deleteUser(id)
  },
}
