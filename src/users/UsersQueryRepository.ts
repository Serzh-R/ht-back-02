import { usersCollection } from '../db/mongoDb'
import { ObjectId } from 'mongodb'
import { PaginatorUserType, UserDBType, UserType } from './types'

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

    const usersCount = await usersCollection.countDocuments(filter)

    const users = await usersCollection
      .find(filter, { projection: { passwordHash: 0, passwordSalt: 0 } })
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray()

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

  async getUserById(id: string): Promise<UserType | null> {
    const user = await usersCollection.findOne<UserDBType>({
      _id: new ObjectId(id),
    })
    return user ? this._mapViewModel(user) : null
  }

  _mapViewModel(user: UserDBType): UserType {
    return new UserType(user._id.toString(), user.login, user.email, user.createdAt.toISOString())
  }
}

export const usersQueryRepository = new UsersQueryRepository()
