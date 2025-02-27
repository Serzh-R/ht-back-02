import { blacklistCollection } from '../db/mongoDb'
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

export const blacklistRepository = new BlacklistRepository()
