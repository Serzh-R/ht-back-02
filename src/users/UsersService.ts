import { usersRepository } from './UsersRepository'
import { bcryptService } from '../common/adapters/bcrypt.service'
import { UserInputType, UserRegInsertDBType } from './types'
import { Result } from '../common/result/result.type'
import { ResultStatus } from '../common/result/resultCode'
import { ObjectId } from 'mongodb'
import { randomUUID } from 'node:crypto'

export const usersService = {
  async createUser(body: UserInputType): Promise<Result<{ userId: string } | null>> {
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

    const passwordHash = await bcryptService.generateHash(body.password)

    const userDB: UserRegInsertDBType = {
      login: body.login,
      email: body.email,
      passwordHash,
      createdAt: new Date(),
      emailConfirmation: {
        confirmationCode: randomUUID(),
        expirationDate: new Date(),
        isConfirmed: false,
      },
    }

    const userId = await usersRepository.createUser(userDB)

    return {
      status: ResultStatus.Success,
      data: { userId: userId.toString() },
      extensions: [],
    }
  },

  async deleteUser(id: string): Promise<boolean> {
    if (!ObjectId.isValid(id)) {
      console.error('Incorrect id passed:', id)
      return false
    }
    return await usersRepository.deleteUser(id)
  },
}
