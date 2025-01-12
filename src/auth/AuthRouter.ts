import { Router, Request, Response } from 'express'
import { HTTP_STATUSES } from '../settings'
import { errorsResultMiddleware } from '../validation/express-validator/errors-result-middleware'
import {
  loginOrEmailValidation,
  passwordValidation,
} from '../users/middlewares/user-validators'
import { authService } from './AuthService'
import { LoginOrEmailInputType } from '../types/types'
import { usersService } from '../users/UsersService'

export const authRouter = Router()

authRouter.post(
  '/login',
  loginOrEmailValidation,
  passwordValidation,
  errorsResultMiddleware,
  async (req: Request, res: Response): Promise<LoginOrEmailInputType> => {
    const { loginOrEmail, password } = req.body
    const accessToken = await authService.loginUser(loginOrEmail, password)

    const checkResult = await usersService.checkCredentials(
      req.body.loginOrEmail,
      req.body.password,
    )

    return res.status(HTTP_STATUSES.NO_CONTENT_204).send({ accessToken })
  },
)
