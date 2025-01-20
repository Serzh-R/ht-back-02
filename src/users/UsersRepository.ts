import { ObjectId } from 'mongodb'
import { usersCollection } from '../db/mongoDb'
import { UserDBInsertType, UserDBType, UserRegisterDBType } from '../auth/types/types'

export const usersRepository = {
  /*async createUser(user: UserDBInsertType): Promise<ObjectId> {
    const result = await usersCollection.insertOne(user as UserDBType)
    return result.insertedId
  },*/

  async createUser(user: UserRegisterDBType): Promise<UserRegisterDBType> {
    const result = await usersCollection.insertOne(user)
    return user
  },

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
