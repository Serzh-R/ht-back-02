import jwt from 'jsonwebtoken'
import { AC_SECRET, AC_TIME } from '../../settings'

export const jwtService = {
  async createToken(userId: string): Promise<string> {
    return jwt.sign({ userId }, AC_SECRET, {
      expiresIn: AC_TIME,
    })
  },
  async decodeToken(token: string): Promise<any> {
    try {
      return jwt.decode(token)
    } catch (e: unknown) {
      console.error("Can't decode token", e)
      return null
    }
  },
  async verifyToken(token: string): Promise<{ userId: string } | null> {
    try {
      return jwt.verify(token, AC_SECRET) as { userId: string }
    } catch (error) {
      console.error('Token verify some error')
      return null
    }
  },

  /*verifyToken(token: string): DecodedToken | null {
    try {
      return jwt.verify(token, SECRET_KEY) as DecodedToken
    } catch (error) {
      return null
    }
  },*/
}
