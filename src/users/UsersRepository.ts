import { ObjectId, OptionalId } from 'mongodb'
import { UserDBInsertType, UserDBType } from '../types/types'
import { usersCollection } from '../db/mongoDb'

export const usersRepository = {
  async createUser(user: UserDBInsertType): Promise<ObjectId> {
    const result = await usersCollection.insertOne(user as UserDBType)
    return result.insertedId
  },

  /*async findUserById(id: string): Promise<UserDBType | null> {
    return await usersCollection.findOne({ _id: new ObjectId(id) })
  },*/

  async findByLoginOrEmail(loginOrEmail: string): Promise<UserDBType | null> {
    return await usersCollection.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    })
  },

  async deleteUser(id: string): Promise<boolean> {
    const result = await usersCollection.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  },
}
