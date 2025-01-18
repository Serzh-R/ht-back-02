import { FieldErrorType, UserDBInsertType, UserInputType } from '../types/types'
import { usersRepository } from './UsersRepository'
import { bcryptService } from '../common/adapters/bcrypt.service'

export const usersService = {
  async createUser(
    body: UserInputType,
  ): Promise<{ userId: string | null; errorsMessages: FieldErrorType[] }> {
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

    const { passwordHash } = await bcryptService.generateHash(body.password)

    const userDB: UserDBInsertType = {
      login: body.login,
      email: body.email,
      passwordHash,
      createdAt: new Date(),
    }

    const userId = await usersRepository.createUser(userDB)

    return {
      userId: userId.toString(),
      errorsMessages: [],
    }
  },

  /*async checkCredentials(loginOrEmail: string, password: string): Promise<UserType | null> {
    const user = await usersRepository.findByLoginOrEmail(loginOrEmail)
    if (!user) return null
    const isPasswordCorrect = await bcryptService.checkPassword(password, user.passwordHash)
    if (!isPasswordCorrect) return null

    return {
      id: user._id.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
    }
  },*/

  async deleteUser(id: string): Promise<boolean> {
    return await usersRepository.deleteUser(id)
  },
}
