import jwt, { JwtPayload } from 'jsonwebtoken'
import { ACCESS_SECRET, REFRESH_SECRET, ACCESS_TIME, REFRESH_TIME } from '../../settings'
import { ObjectId } from 'mongodb'

export interface RefreshTokenPayload extends JwtPayload {
  userId: string
  deviceId: string
}

export const jwtService = {
  async createAccessToken(userId: string): Promise<string> {
    return jwt.sign({ userId }, ACCESS_SECRET, { expiresIn: Number(ACCESS_TIME) })
  },

  async createRefreshToken(userId: string, deviceId: string): Promise<string> {
    return jwt.sign({ userId, deviceId } as RefreshTokenPayload, REFRESH_SECRET, {
      expiresIn: Number(REFRESH_TIME),
    })
  },

  async getUserIdByAccessToken(accessToken: string): Promise<ObjectId | null> {
    try {
      const result = jwt.verify(accessToken, ACCESS_SECRET) as { userId: string }
      return new ObjectId(result.userId)
    } catch (error) {
      console.error('AccessToken verify some error')
      return null
    }
  },

  async getUserIdByRefreshToken(refreshToken: string): Promise<ObjectId | null> {
    try {
      const result = jwt.verify(refreshToken, REFRESH_SECRET) as { userId: string }
      return new ObjectId(result.userId)
    } catch (error) {
      console.error('RefreshToken verify some error')
      return null
    }
  },

  async verifyAccessToken(accessToken: string) {
    try {
      return jwt.verify(accessToken, ACCESS_SECRET) as { userId: string }
    } catch {
      return null
    }
  },

  verifyRefreshToken(refreshToken: string): RefreshTokenPayload | null {
    try {
      return jwt.verify(refreshToken, REFRESH_SECRET) as RefreshTokenPayload | null
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
