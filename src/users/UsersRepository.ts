import { ObjectId, WithId } from 'mongodb'
import {
  UserDBType,
  UserFullType,
  UserInputType,
  UserType,
} from '../types/types'
import { usersCollection } from '../db/mongoDb'

export const usersRepository = {
  async createUser(newUser: UserInputType): Promise<string> {
    const user = await usersCollection.insertOne(newUser)
    return user.insertedId.toString()
  },

  async findUserById(id: ObjectId): Promise<WithId<UserType> | null> {
    //if (!this._checkObjectId(id)) return null

    let user = await usersCollection.findOne({ _id: new ObjectId(id) })
    if (user) {
      return user
    } else {
      return null
    }
  },

  async findByLoginOrEmail(loginOrEmail: string): Promise<UserDBType | null> {
    const user = await usersCollection.findOne({
      $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
    })
    if (!user) {
      return null
    }
    return user
  },

  async deleteUser(id: string): Promise<boolean> {
    const user = await usersCollection.deleteOne({ _id: new ObjectId(id) })
    return user.deletedCount === 1
  },

  /*_checkObjectId(id: ObjectId): boolean {
    return ObjectId.isValid(id)
  },*/
}
