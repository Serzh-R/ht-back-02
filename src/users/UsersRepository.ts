import { ObjectId } from 'mongodb'
import { UserRegDB, UserRegInsertDBType } from './user-types'
import { UserModel } from './user-schema'

class UsersRepository {
  async createUser(user: UserRegInsertDBType): Promise<ObjectId> {
    const newUser = await UserModel.create(user)
    return newUser._id
  }

  async findById(userId: string) {
    if (!ObjectId.isValid(userId)) return null
    return await UserModel.findById(userId).lean()
  }

  async findByLoginOrEmail(loginOrEmail: string): Promise<UserRegDB | null> {
    return await UserModel.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    }).lean()
  }

  async findUserByConfirmationCode(emailConfirmationCode: string): Promise<UserRegDB | null> {
    return await UserModel.findOne({
      'emailConfirmation.confirmationCode': emailConfirmationCode,
    }).lean()
  }

  async updateConfirmationCode(
    _id: ObjectId,
    emailConfirmation: {
      confirmationCode: string
      expirationDate: Date
      isConfirmed: boolean
    },
  ): Promise<boolean> {
    const result = await UserModel.updateOne({ _id }, { $set: { emailConfirmation } })
    return result.modifiedCount === 1
  }

  async updateConfirmation(_id: ObjectId): Promise<boolean> {
    const result = await UserModel.updateOne(
      { _id },
      { $set: { 'emailConfirmation.isConfirmed': true } },
    )
    return result.modifiedCount === 1
  }

  async updatePassword(_id: ObjectId, passwordHash: string): Promise<boolean> {
    const result = await UserModel.updateOne(
      { _id },
      { $set: { passwordHash, 'emailConfirmation.isConfirmed': true } },
    )
    return result.modifiedCount === 1
  }

  async updateRefreshToken(userId: string, newRefreshToken: string | null): Promise<boolean> {
    if (!ObjectId.isValid(userId)) return false

    const result = await UserModel.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { refreshToken: newRefreshToken } },
    )

    return result.modifiedCount > 0
  }

  async deleteUser(id: string): Promise<boolean> {
    if (!ObjectId.isValid(id)) return false

    try {
      const result = await UserModel.deleteOne({ _id: new ObjectId(id) })
      return result.deletedCount > 0
    } catch (error) {
      console.error('Error deleting user:', error)
      return false
    }
  }
}

export const usersRepository = new UsersRepository()

// ************************************************************************** //

/*
import { ObjectId } from 'mongodb'
import { usersCollection } from '../db/mongoDb'
import { UserRegDB, UserRegInsertDBType } from './user-types'

class UsersRepository {
  async createUser(user: UserRegInsertDBType): Promise<ObjectId> {
    const result = await usersCollection.insertOne(user as UserRegDB)
    return result.insertedId
  }

  async findById(userId: string) {
    return usersCollection.findOne({ _id: new ObjectId(userId) })
  }

  async findByLoginOrEmail(loginOrEmail: string): Promise<UserRegDB | null> {
    return await usersCollection.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    })
  }

  async findUserByConfirmationCode(emailConfirmationCode: string): Promise<UserRegDB | null> {
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

  async updatePassword(_id: ObjectId, passwordHash: string): Promise<boolean> {
    const result = await usersCollection.updateOne(
      { _id },
      { $set: { passwordHash, 'emailConfirmation.isConfirmed': true } },
    )
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
*/
