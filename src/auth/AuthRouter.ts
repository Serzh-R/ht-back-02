import { Router, Request, Response } from 'express'
import { HTTP_STATUSES } from '../settings'
import { authService } from './AuthService'
import {
  emailValidation,
  isUserConfirmedByEmailValidation,
  loginOrEmailValidation,
  loginValidation,
  passwordValidation,
} from '../users/middlewares/user.validators'
import { errorsResultMiddleware } from '../validation/express-validator/errors.result.middleware'
import { jwtAuthMiddleware } from '../middlewares/jwt.auth.middleware'
import { usersQueryRepository } from '../users/UsersQueryRepository'
import { ResultStatus } from '../common/result/resultCode'

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
    const { email } = req.body
    const result = await authService.registerEmailResending(email)

    if (result.status === ResultStatus.BadRequest) {
      res.status(HTTP_STATUSES.BAD_REQUEST_400).send({
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
      res.status(HTTP_STATUSES.UNAUTHORIZED_401).json({
        errorsMessages: result.extensions,
      })
      return
    }

    res.status(HTTP_STATUSES.OK_200).send({ accessToken: result.data!.accessToken })
  },

  // TODO: Remove
  async me(req: Request, res: Response) {
    const userId = req.userId

    if (!userId) {
      res.status(HTTP_STATUSES.UNAUTHORIZED_401).send({
        errorsMessages: [{ field: 'authorization', message: 'Unauthorized' }],
      })
      return
    }

    const user = await usersQueryRepository.getUserById(userId)

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

  async refreshToken(req: Request, res: Response): Promise<void> {
    const refreshToken = req.cookies?.refreshToken

    if (!refreshToken) {
      res.status(HTTP_STATUSES.UNAUTHORIZED_401).json({ message: 'Refresh token missing' })
      return
    }

    const result = await authService.refreshToken(refreshToken)

    if (result.status !== ResultStatus.Success) {
      res.status(HTTP_STATUSES.UNAUTHORIZED_401).json({
        message: result.errorMessage,
        extensions: result.extensions,
      })
      return
    }

    // Устанавливаем новый refresh-токен в httpOnly cookie
    res.cookie('refreshToken', result.data!.refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 20 * 1000,
      sameSite: 'strict',
    })

    res.status(HTTP_STATUSES.OK_200).json({ accessToken: result.data!.accessToken })
  },

  async logout(req: Request, res: Response): Promise<void> {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      res.status(HTTP_STATUSES.UNAUTHORIZED_401).json({ message: 'Refresh token missing' });
      return
    }

    const result = await authService.logout(refreshToken);

    if (result.status !== ResultStatus.Success) {
      res.status(HTTP_STATUSES.UNAUTHORIZED_401).json({
        message: result.errorMessage,
        extensions: result.extensions,
      })
      return
    }

    // Очистка refresh-токена в cookie
    res.cookie('refreshToken', '', {
      httpOnly: true,
      secure: true,
      maxAge: 0,
      sameSite: 'strict',
    });

    res.status(HTTP_STATUSES.NO_CONTENT_204).send()
  }
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
  isUserConfirmedByEmailValidation,
  errorsResultMiddleware,
  authController.registerEmailResending,
)

authRouter.get('/me', jwtAuthMiddleware, authController.me)

authRouter.post('/refresh-token', jwtAuthMiddleware, authController.refreshToken)

authRouter.post('/logout', jwtAuthMiddleware, authController.logout)
