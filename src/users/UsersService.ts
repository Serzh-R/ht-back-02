import { usersRepository } from './UsersRepository'
import { bcryptService } from '../common/adapters/bcrypt.service'
import { UserDBInsertType, UserInputType } from '../auth/types/types'
import { FieldErrorType } from '../types/types'

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

  /*async createUser(body: UserInputType): Promise<Result<UserType | null>> {
    const userByLogin = await usersRepository.findByLoginOrEmail(body.login)
    if (userByLogin) {
      return {
        status: ResultStatus.Forbidden,
        errorMessage: 'Login already exists',
        extensions: [{ field: 'login', message: 'login should be unique' }],
        data: null,
      }
    }

    const userByEmail = await usersRepository.findByLoginOrEmail(body.email)
    if (userByEmail) {
      return {
        status: ResultStatus.Forbidden,
        errorMessage: 'Email already exists',
        extensions: [{ field: 'email', message: 'email should be unique' }],
        data: null,
      }
    }

    const { passwordHash } = await bcryptService.generateHash(body.password)

    const userDB: UserDBInsertType = {
      login: body.login,
      email: body.email,
      passwordHash,
      createdAt: new Date(),
    }

    const user = await usersRepository.createUser(userDB)

    return {
      status: ResultStatus.Success,
      data: user,
      extensions: [],
    }
  },*/

  async deleteUser(id: string): Promise<boolean> {
    return await usersRepository.deleteUser(id)
  },
}
