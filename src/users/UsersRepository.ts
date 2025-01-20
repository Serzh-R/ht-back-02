import { ObjectId } from 'mongodb'
import { usersCollection } from '../db/mongoDb'
import { UserDBInsertType, UserRegDBType, UserRegInsertDBType } from '../auth/types/types'

export const usersRepository = {
  async createUser(user: UserRegInsertDBType): Promise<ObjectId> {
    const result = await usersCollection.insertOne(user as UserRegDBType)
    return result.insertedId
  },

  async findByLoginOrEmail(loginOrEmail: string): Promise<UserDBInsertType | null> {
    return await usersCollection.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    })
  },

  async deleteUser(id: string): Promise<boolean> {
    const result = await usersCollection.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  },
}
