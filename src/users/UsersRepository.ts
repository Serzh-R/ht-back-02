import { ObjectId } from 'mongodb'
import { usersCollection } from '../db/mongoDb'
import { UserRegDBType, UserRegInsertDBType } from './user-types'

class UsersRepository {
  async createUser(user: UserRegInsertDBType): Promise<ObjectId> {
    const result = await usersCollection.insertOne(user as UserRegDBType)
    return result.insertedId
  }

  async findById(userId: string) {
    return usersCollection.findOne({ _id: new ObjectId(userId) })
  }

  async findByLoginOrEmail(loginOrEmail: string): Promise<UserRegDBType | null> {
    return await usersCollection.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    })
  }

  async findUserByConfirmationCode(emailConfirmationCode: string): Promise<UserRegDBType | null> {
    const user = await usersCollection.findOne({
      'emailConfirmation.confirmationCode': emailConfirmationCode,
    })
    return user
  }

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
  }

  async updateConfirmation(_id: ObjectId) {
    let result = await usersCollection.updateOne(
      { _id },
      { $set: { 'emailConfirmation.isConfirmed': true } },
    )
    return result.modifiedCount === 1
  }

  async updatePassword(_id: ObjectId, password: string): Promise<boolean> {
    const result = await usersCollection.updateOne({ _id }, { $set: { password } })
    return result.modifiedCount === 1
  }

  async updateRefreshToken(userId: string, newRefreshToken: string | null): Promise<boolean> {
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { refreshToken: newRefreshToken } },
    )

    return result.modifiedCount > 0
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      const result = await usersCollection.deleteOne({ _id: new ObjectId(id) })
      return result.deletedCount > 0
    } catch (error) {
      console.error('Error deleting user:', error)
      return false
    }
  }
}

export const usersRepository = new UsersRepository()
