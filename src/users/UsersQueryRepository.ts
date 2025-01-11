import { usersCollection } from '../db/mongoDb'
import { PaginatorUserType } from '../types/types'

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
      .find(filter, { projection: { passwordHash: 0, _id: 0 } })
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray()

    return {
      pagesCount: Math.ceil(usersCount / pageSize),
      page: pageNumber,
      pageSize,
      totalCount: usersCount,
      items: users,
    }
  },
}
