import { blacklistCollection } from '../db/mongoDb'

export const blacklistRepository = {
  async addTokenToBlacklist(refreshToken: string) {
    return await blacklistCollection.insertOne({
      refreshToken: refreshToken,
      createdAt: new Date(),
    })
  },

  async isTokenBlacklisted(token: string) {
    const result = await blacklistCollection.findOne({ token })
    return !!result
  },
}
