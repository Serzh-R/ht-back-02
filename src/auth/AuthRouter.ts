import { Router, Request, Response } from 'express'
import { usersService } from '../users/UsersService'
import { HTTP_STATUSES } from '../settings'
import { authService } from './AuthService'
import { loginOrEmailValidation, passwordValidation } from '../users/middlewares/user-validators'
import { errorsResultMiddleware } from '../validation/express-validator/errors-result-middleware'
import { jwtAuthMiddleware } from '../middlewares/jwt-auth-middleware'
import { usersQueryRepository } from '../users/UsersQueryRepository'

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

  async me(req: Request, res: Response) {
    const userId = req.userId

    if (!userId) {
      res.status(HTTP_STATUSES.UNAUTHORIZED_401).send({
        errorsMessages: [{ field: 'authorization', message: 'Unauthorized' }],
      })
      return
    }

    const user = await usersQueryRepository.findUserById(userId)

    if (!user) {
      res.status(HTTP_STATUSES.UNAUTHORIZED_401).send({
        errorsMessages: [{ field: 'authorization', message: 'User not found' }],
      })
      return
    }

    res.status(HTTP_STATUSES.OK_200).send({
      email: user.email,
      login: user.login,
      userId: user.id,
    })
  },
}

authRouter.post(
  '/login',
  loginOrEmailValidation,
  passwordValidation,
  errorsResultMiddleware,
  authController.login,
)

authRouter.get('/me', jwtAuthMiddleware, authController.me)

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
