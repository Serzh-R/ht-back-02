import { Router, Request, Response } from 'express'
import { HTTP_STATUSES } from '../settings'
import { authService } from './AuthService'
import { loginOrEmailValidation, passwordValidation } from '../users/middlewares/user.validators'
import { errorsResultMiddleware } from '../validation/express-validator/errors.result.middleware'
import { jwtAuthMiddleware } from '../middlewares/jwt.auth.middleware'
import { usersQueryRepository } from '../users/UsersQueryRepository'
import { ResultStatus } from '../common/result/resultCode'
import { resultCodeToHttpException } from '../common/result/resultCodeToHttpException'

export const authRouter = Router()

export const authController = {
  async registerUser(req: Request, res: Response): Promise<void> {
    const user = await authService.registerUser(req.body.login, req.body.email, req.body.password)

    if (!user) {
      res.status(HTTP_STATUSES.BAD_REQUEST_400).send()
      return
    }
    res.status(HTTP_STATUSES.CREATED_201).send()
  },

  async registerConfirm(req: Request, res: Response): Promise<void> {
    const result = await authService.registerConfirm(req.body.code)

    if (!result) {
      res.status(HTTP_STATUSES.BAD_REQUEST_400).send()
      return
    }
    res.status(HTTP_STATUSES.CREATED_201).send()
  },

  async registerEmailResending(req: Request, res: Response): Promise<void> {},

  async login(req: Request, res: Response) {
    const { loginOrEmail, password } = req.body
    const result = await authService.loginUser(loginOrEmail, password)

    if (result.status !== ResultStatus.Success) {
      res.status(resultCodeToHttpException(result.status)).send(result.extensions)
      return
    }
    res.status(HTTP_STATUSES.OK_200).send({ accessToken: result.data!.accessToken })
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

authRouter.post(
  '/registration',
  loginOrEmailValidation,
  passwordValidation,
  errorsResultMiddleware,
  authController.registerUser,
)

authRouter.post(
  '/registration-confirmation',
  loginOrEmailValidation,
  passwordValidation,
  errorsResultMiddleware,
  authController.registerConfirm,
)

authRouter.get('/me', jwtAuthMiddleware, authController.me)
