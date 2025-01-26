import { Router, Request, Response } from 'express'
import { HTTP_STATUSES } from '../settings'
import { authService } from './AuthService'
import {
  emailValidation,
  loginOrEmailValidation,
  loginValidation,
  passwordValidation,
} from '../users/middlewares/user.validators'
import { errorsResultMiddleware } from '../validation/express-validator/errors.result.middleware'
import { jwtAuthMiddleware } from '../middlewares/jwt.auth.middleware'
import { usersQueryRepository } from '../users/UsersQueryRepository'
import { ResultStatus } from '../common/result/resultCode'
import { resultCodeToHttpException } from '../common/result/resultCodeToHttpException'

export const authRouter = Router()

export const authController = {
  async registerUser(req: Request, res: Response): Promise<void> {
    const user = await authService.registerUser(req.body.login, req.body.email, req.body.password)

    if (!user || user.status !== ResultStatus.Success) {
      res.status(HTTP_STATUSES.BAD_REQUEST_400).send()
      return
    }
    res.status(HTTP_STATUSES.NO_CONTENT_204).send()
  },

  async registerConfirm(req: Request, res: Response): Promise<void> {
    const { code } = req.body

    const result = await authService.registerConfirm(code)

    if (!result.data) {
      res.status(HTTP_STATUSES.BAD_REQUEST_400).json({
        errorsMessages: [
          {
            message: 'Invalid or expired confirmation code',
            field: 'code',
          },
        ],
      })
      return
    }
    res.status(HTTP_STATUSES.NO_CONTENT_204).send()
  },

  async registerEmailResending(req: Request, res: Response): Promise<void> {
    const result = await authService.registerEmailResending(req.body.email)

    if (result.status === ResultStatus.BadRequest) {
      res.status(400).json({
        errorsMessages: result.extensions,
      })
      return
    }

    res.status(HTTP_STATUSES.NO_CONTENT_204).send()
  },

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
  loginValidation,
  passwordValidation,
  emailValidation,
  errorsResultMiddleware,
  authController.registerUser,
)

authRouter.post(
  '/registration-confirmation',
  errorsResultMiddleware,
  authController.registerConfirm,
)

authRouter.post(
  '/registration-email-resending',
  emailValidation,
  errorsResultMiddleware,
  authController.registerEmailResending,
)

authRouter.get('/me', jwtAuthMiddleware, authController.me)
