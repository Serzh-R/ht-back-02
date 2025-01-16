import { Request, Response, NextFunction } from 'express'
import { authService } from '../auth/AuthService'
import { HTTP_STATUSES } from '../settings'
import { DecodedToken } from '../coment/types'

export const jwtAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(HTTP_STATUSES.UNAUTHORIZED_401).send({
      errorsMessages: [{ field: 'authorization', message: 'Token is missing or invalid' }],
    })
    return
  }

  const token = authHeader.split(' ')[1]

  const user = authService.verifyToken(token) as DecodedToken | null

  if (!user) {
    res.status(HTTP_STATUSES.UNAUTHORIZED_401).send({
      errorsMessages: [{ field: 'authorization', message: 'Invalid token' }],
    })
    return
  }

  req.userId = user.userId
  next()
}
