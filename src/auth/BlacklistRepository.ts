import { blacklistCollection } from '../db/mongoDb'

export const blacklistRepository = {
  async addTokenToBlacklist(token: string) {
    return await blacklistCollection.insertOne({
      token,
      createdAt: new Date(),
    })
  },

  async isTokenBlacklisted(token: string) {
    const result = await blacklistCollection.findOne({ token })
    return !!result
  },
}
