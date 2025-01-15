import jwt from 'jsonwebtoken'
import { DecodedToken } from '../coment/types'
import { SECRET_KEY } from '../settings'

export const authService = {
  generateToken(userId: string): string {
    const payload = {
      userId,
    }

    return jwt.sign(payload, SECRET_KEY, {
      expiresIn: '1h',
    })
  },

  verifyToken(token: string): DecodedToken | null {
    try {
      return jwt.verify(token, SECRET_KEY) as DecodedToken
    } catch (error) {
      return null
    }
  },
}
