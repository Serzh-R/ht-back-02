import { usersCollection } from '../db/mongoDb'
import { PaginatorUserType, UserDBInsertType, UserDBType, UserType } from '../types/types'
import { ObjectId } from 'mongodb'

export const usersQueryRepository = {
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

    return {
      pagesCount: Math.ceil(usersCount / pageSize),
      page: pageNumber,
      pageSize,
      totalCount: usersCount,
      items: users.map((user) => this._mapViewModel(user)),
    }
  },

  async findUserById(id: string): Promise<UserType | null> {
    const user = await usersCollection.findOne<UserDBType>({
      _id: new ObjectId(id),
    })
    return user ? this._mapViewModel(user) : null
  },

  _mapViewModel(user: UserDBType): UserType {
    return {
      id: user._id.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
    }
  },
}
