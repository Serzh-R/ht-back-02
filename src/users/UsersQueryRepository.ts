import { ObjectId } from 'mongodb'
import { PaginatorUserType, UserDB, User } from './user-types'
import { UserModel } from './user-schema'

class UsersQueryRepository {
  async getUsers(
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    pageNumber: number,
    pageSize: number,
    searchLoginTerm: string | null,
    searchEmailTerm: string | null,
  ): Promise<PaginatorUserType> {
    const filter: any = {}

    if (searchLoginTerm || searchEmailTerm) {
      filter.$or = []

      if (searchLoginTerm) {
        filter.$or.push({ login: { $regex: searchLoginTerm, $options: 'i' } })
      }

      if (searchEmailTerm) {
        filter.$or.push({ email: { $regex: searchEmailTerm, $options: 'i' } })
      }
    }

    const usersCount = await UserModel.countDocuments(filter)

    const users = await UserModel.find(filter)
      .select('-passwordHash -passwordSalt') // Исключаем пароли
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lean() // Конвертируем в обычные объекты JS (ускоряет работу)

    // Преобразуем UserDBType в UserType
    const userItems = users.map((user) => this._mapViewModel(user))

    return new PaginatorUserType(
      Math.ceil(usersCount / pageSize),
      pageNumber,
      pageSize,
      usersCount,
      userItems,
    )
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await UserModel.findOne<UserDB>({
      _id: new ObjectId(id),
    })
    return user ? this._mapViewModel(user) : null
  }

  _mapViewModel(user: UserDB): User {
    return new User(user._id.toString(), user.login, user.email, user.createdAt.toISOString())
  }
}

export const usersQueryRepository = new UsersQueryRepository()
