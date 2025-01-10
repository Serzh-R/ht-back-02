import { Router, Request, Response } from 'express'
import { HTTP_STATUSES } from '../settings'
import { errorsResultMiddleware } from '../validation/express-validator/errors-result-middleware'
import {
  loginOrEmailValidation,
  passwordValidation,
} from '../users/middlewares/user-validators'
import { authService } from './auth-service'

export const authRouter = Router()

authRouter.post(
  '/auth/login',
  loginOrEmailValidation,
  passwordValidation,
  errorsResultMiddleware,
  async (req: Request, res: Response) => {
    const { loginOrEmail, password } = req.body

    const accessToken = await authService.loginUser(loginOrEmail, password)
    if (!accessToken) return res.sendStatus(401)

    return res.status(HTTP_STATUSES.OK_200).send({ accessToken })
  },
)
