import jwt from 'jsonwebtoken'
import { JWT_SECRET, JWT_TIME } from '../../settings'
import { ObjectId } from 'mongodb'

export const jwtService = {
  async createToken(userId: string): Promise<string> {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: Number(JWT_TIME) })
  },

  async getUserIdByToken(token: string): Promise<ObjectId | null> {
    try {
      const result = jwt.verify(token, JWT_SECRET) as { userId: string }
      return new ObjectId(result.userId)
    } catch (error) {
      console.error('Token verify some error')
      return null
    }
  },

  async decodeToken(token: string): Promise<any> {
    try {
      return jwt.decode(token)
    } catch (e: unknown) {
      console.error("Can't decode token", e)
      return null
    }
  },
}
