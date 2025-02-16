import jwt from 'jsonwebtoken'
import { ACCESS_SECRET, REFRESH_SECRET, ACCESS_TIME, REFRESH_TIME } from '../../settings'
import { ObjectId } from 'mongodb'

export const jwtService = {
  async createAccessToken(userId: string): Promise<string> {
    return jwt.sign({ userId }, ACCESS_SECRET, { expiresIn: Number(ACCESS_TIME) })
  },

  async createRefreshToken(userId: string, deviceId: string): Promise<string> {
    return jwt.sign({ userId, deviceId }, REFRESH_SECRET, { expiresIn: Number(REFRESH_TIME) })
  },

  async getUserIdByAccessToken(token: string): Promise<ObjectId | null> {
    try {
      const result = jwt.verify(token, ACCESS_SECRET) as { userId: string }
      return new ObjectId(result.userId)
    } catch (error) {
      console.error('AccessToken verify some error')
      return null
    }
  },

  async getUserIdByRefreshToken(token: string): Promise<ObjectId | null> {
    try {
      const result = jwt.verify(token, REFRESH_SECRET) as { userId: string }
      return new ObjectId(result.userId)
    } catch (error) {
      console.error('RefreshToken verify some error')
      return null
    }
  },

  async verifyAccessToken(token: string) {
    try {
      return jwt.verify(token, ACCESS_SECRET) as { userId: string }
    } catch {
      return null
    }
  },

  async verifyRefreshToken(refreshToken: string) {
    try {
      return jwt.verify(refreshToken, REFRESH_SECRET) as {
        userId: string
        deviceId: string
        lastActiveDate: Date
      }
    } catch {
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
