import { BlacklistModel } from '../users/user-schema'

class BlacklistRepository {
  async addTokenToBlacklist(token: string): Promise<boolean> {
    try {
      await BlacklistModel.create({ refreshToken: token })
      return true
    } catch (error) {
      console.error('Error adding token to blacklist:', error)
      return false
    }
  }

  async isTokenBlacklisted(refreshToken: string): Promise<boolean> {
    const result = await BlacklistModel.findOne({ refreshToken }).lean()
    return !!result
  }
}

export const blacklistRepository = new BlacklistRepository()

// ******************************************************************** //

/*import { blacklistCollection } from '../db/mongoDb'
import { ObjectId } from 'mongodb'

class BlacklistRepository {
  async addTokenToBlacklist(token: string): Promise<boolean> {
    const result = await blacklistCollection.insertOne({
      refreshToken: token,
      _id: new ObjectId(),
      createdAt: new Date(),
    })
    return !!result
  }

  async isTokenBlacklisted(refreshToken: string) {
    const result = await blacklistCollection.findOne({ refreshToken })
    return !!result
  }
}

export const blacklistRepository = new BlacklistRepository()*/
