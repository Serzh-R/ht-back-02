import { Request, Response, NextFunction } from 'express'
import { HTTP_STATUSES } from '../../settings'
import { jwtService } from '../../common/adapters/jwt.service'

export const jwtRefreshAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies?.refreshToken

    if (!refreshToken) {
      res.status(HTTP_STATUSES.UNAUTHORIZED_401).send({
        errorsMessages: [
          { field: 'authorization', message: 'Refresh token is missing or invalid' },
        ],
      })
      return
    }

    const decoded = jwtService.verifyRefreshToken(refreshToken)

    if (!decoded) {
      res.status(HTTP_STATUSES.UNAUTHORIZED_401).send({
        errorsMessages: [{ field: 'authorization', message: 'Invalid refresh token' }],
      })
      return
    }

    req.userId = decoded.userId

    next()
  } catch (error) {
    console.error('JWT Refresh Token Middleware Error:', error)
    res.status(HTTP_STATUSES.UNAUTHORIZED_401).send({
      errorsMessages: [{ field: 'authorization', message: 'Internal server error' }],
    })
  }
}
