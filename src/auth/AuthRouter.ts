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
import { resultCodeToHttpException } from '../common/result/resultCodeToHttpException'
import { jwtService } from '../common/adapters/jwt.service'
import { usersRepository } from '../users/UsersRepository'

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

    // Проверяем refresh-токен
    const decoded = await jwtService.verifyRefreshToken(refreshToken)
    if (!decoded) {
      res.status(HTTP_STATUSES.UNAUTHORIZED_401).json({ message: 'Invalid refresh token' })
      return
    }

    const user = await jwtService.getUserIdByRefreshToken(decoded.userId)
    if (!user) {
      res.status(HTTP_STATUSES.UNAUTHORIZED_401).json({ message: 'User not found' })
      return
    }

    // Генерируем новые токены
    const newAccessToken = await jwtService.createAccessToken(user.id)
    const newRefreshToken = await jwtService.createRefreshToken(user.id)

    // Обновляем refresh-токен в базе данных (если используется хранение refresh-токенов)
    await usersRepository.updateRefreshToken(user.id, newRefreshToken)

    // Устанавливаем новый refresh-токен в httpOnly cookie
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 20 * 1000, // 20 секунд
      sameSite: 'strict',
    })

    // Отправляем новый access-токен в теле ответа
    res.status(HTTP_STATUSES.OK_200).json({ accessToken: newAccessToken })
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
  isUserConfirmedByEmailValidation,
  errorsResultMiddleware,
  authController.registerEmailResending,
)

authRouter.get('/me', jwtAuthMiddleware, authController.me)

authRouter.post('/refresh-token', jwtAuthMiddleware, authController.refreshToken)
