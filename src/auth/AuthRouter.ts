import { Router, Request, Response } from 'express'
import { usersService } from '../users/UsersService'
import { HTTP_STATUSES } from '../settings'
import { authService } from './AuthService'
import { jwtAuthMiddleware } from '../middlewares/jwt-auth-middleware'

export const authRouter = Router()

export const authController = {
  async login(req: Request, res: Response) {
    const { loginOrEmail, password } = req.body

    const user = await usersService.checkCredentials(loginOrEmail, password)

    if (!user) {
      res.status(HTTP_STATUSES.UNAUTHORIZED_401).send({
        errorsMessages: [{ field: 'loginOrEmail', message: 'Invalid credentials' }],
      })
      return
    }

    const token = authService.generateToken(user.id)

    res.status(HTTP_STATUSES.OK_200).send({ accessToken: token })
  },
}

authRouter.post('/login', jwtAuthMiddleware, authController.login)

/*authRouter.post(
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
)*/
