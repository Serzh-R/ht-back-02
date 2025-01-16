import { Request, Response, NextFunction } from 'express'
import { HTTP_STATUSES } from '../settings'
import { jwtService } from '../common/adapters/jwt.service'

export const jwtAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(HTTP_STATUSES.UNAUTHORIZED_401).send({
      errorsMessages: [{ field: 'authorization', message: 'Token is missing or invalid' }],
    })
    return
  }

  const token = authHeader.split(' ')[1]

  const user = (await jwtService.verifyToken(token)) as { userId: string }

  if (!user) {
    res.status(HTTP_STATUSES.UNAUTHORIZED_401).send({
      errorsMessages: [{ field: 'authorization', message: 'Invalid token' }],
    })
    return
  }

  req.userId = user.userId
  next()
}
