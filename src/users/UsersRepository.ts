import { ObjectId } from 'mongodb'
import { usersCollection } from '../db/mongoDb'
import { UserRegDBType, UserRegInsertDBType } from '../auth/types/types'

export const usersRepository = {
  async createUser(user: UserRegInsertDBType): Promise<ObjectId> {
    const result = await usersCollection.insertOne(user as UserRegDBType)
    return result.insertedId
  },

  async findById(userId: string) {
    return usersCollection.findOne({ _id: new ObjectId(userId) })
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

  async updateConfirmationCode(
    _id: ObjectId,
    emailConfirmation: {
      confirmationCode: string
      expirationDate: Date
      isConfirmed: boolean
    },
  ): Promise<boolean> {
    const result = await usersCollection.updateOne({ _id }, { $set: { emailConfirmation } })
    return result.modifiedCount === 1
  },

  async updateConfirmation(_id: ObjectId) {
    let result = await usersCollection.updateOne(
      { _id },
      { $set: { 'emailConfirmation.isConfirmed': true } },
    )
    return result.modifiedCount === 1
  },

  async updateRefreshToken(userId: string, newRefreshToken: string | null): Promise<boolean> {
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { refreshToken: newRefreshToken } }
    );

    return result.modifiedCount > 0; // Если обновлён хотя бы 1 документ → true
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
