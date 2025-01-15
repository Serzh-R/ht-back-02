import { Router, Request, Response } from 'express'
import { errorsResultMiddleware } from '../validation/express-validator/errors-result-middleware'
import { loginOrEmailValidation, passwordValidation } from '../users/middlewares/user-validators'
import { usersService } from '../users/UsersService'

export const authRouter = Router()

authRouter.post(
  '/login',
  loginOrEmailValidation,
  passwordValidation,
  errorsResultMiddleware,
  async (req: Request, res: Response) => {
    const { loginOrEmail, password } = req.body

    const isValid = await usersService.checkCredentials(loginOrEmail, password)

    if (!isValid) {
      res.sendStatus(401)
      return
    }
    res.sendStatus(204)
  },
)
