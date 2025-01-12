import { usersCollection } from '../db/mongoDb'
import { PaginatorUserType, UserDBType, UserType } from '../types/types'
import { ObjectId, WithId } from 'mongodb'

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

    if (searchLoginTerm) {
      filter.login = { $regex: searchLoginTerm, $options: 'i' }
    }

    if (searchEmailTerm) {
      filter.email = { $regex: searchEmailTerm, $options: 'i' }
    }

    const usersCount = await usersCollection.countDocuments(filter)

    const users = await usersCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray()

    return {
      pagesCount: Math.ceil(usersCount / pageSize),
      page: pageNumber,
      pageSize,
      totalCount: usersCount,
      items: users.map((user) => this._getInView(user)),
    }
  },

  async findUserById(id: string): Promise<UserType | null> {
    let user: WithId<UserDBType> | null = null

    try {
      user = await usersCollection.findOne({ _id: new ObjectId(id) })
    } catch (err) {
      return null
    }

    return user ? this._getInView(user) : null
    //if (!this._checkObjectId(id)) return null
    //const user = await usersCollection.findOne({ _id: new ObjectId(id) })
    //return user ? this._getInView(user) : null
  },
  _getInView(user: WithId<UserDBType>): UserType {
    return {
      id: user._id.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
    }
  },
  /* _checkObjectId(id: string): boolean {
    return ObjectId.isValid(id)
  },*/
}
