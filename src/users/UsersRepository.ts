import { ObjectId } from 'mongodb'
import { usersCollection } from '../db/mongoDb'
import { UserRegDBType, UserRegInsertDBType } from '../auth/types/types'

export const usersRepository = {
  async createUser(user: UserRegInsertDBType): Promise<ObjectId> {
    const result = await usersCollection.insertOne(user as UserRegDBType)
    return result.insertedId
  },

  async findByLoginOrEmail(loginOrEmail: string): Promise<UserRegDBType | null> {
    return await usersCollection.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    })
  },

  async findUserByConfirmationCode(emailConfirmationCode: string): Promise<UserRegDBType | null> {
    const user = await usersCollection.findOne({
      'emailConfirmation.confirmationCode': emailConfirmationCode,
    })
    return user
  },

  async updateConfirmation(_id: ObjectId) {
    let result = await usersCollection.updateOne(
      { _id },
      { $set: { 'emailConfirmation.isConfirmed': true } },
    )
    return result.modifiedCount === 1
  },

  async deleteUser(id: string): Promise<boolean> {
    try {
      const result = await usersCollection.deleteOne({ _id: new ObjectId(id) })
      return result.deletedCount > 0
    } catch (error) {
      console.error('Error deleting user:', error)
      return false
    }
  },
}
