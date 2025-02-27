import { Router, Request, Response } from 'express'
import { HTTP_STATUSES, REFRESH_TIME } from '../settings'
import { authService } from './AuthService'
import {
  emailValidation,
  isUserConfirmedByEmailValidation,
  loginOrEmailValidation,
  loginValidation,
  newPasswordValidation,
  passwordValidation,
} from '../users/user.validators'
import { errorsResultMiddleware } from '../validation/express-validator/errors.result.middleware'
import { jwtAccessAuthMiddleware } from './middlewares/jwt.access.auth.middleware'
import { ResultStatus } from '../common/result/resultCode'
import { usersRepository } from '../users/UsersRepository'
import { jwtService } from '../common/adapters/jwt.service'
import { MeType } from '../users/user-types'
import { randomUUID } from 'node:crypto'
import { countRequestsMiddleware } from '../middlewares/countRequests.middleware'
import { jwtRefreshAuthMiddleware } from './middlewares/jwt.refresh.auth.middleware'

export const authRouter = Router()

class AuthController {
  async registerUser(req: Request, res: Response): Promise<void> {
    const { login, email, password } = req.body
    const user = await authService.registerUser(login, email, password)

    if (!user || user.status !== ResultStatus.Success) {
      res.status(HTTP_STATUSES.BAD_REQUEST_400).send()
      return
    }
    res.status(HTTP_STATUSES.NO_CONTENT_204).send()
  }

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
  }

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
  }

  async login(req: Request, res: Response) {
    const userAgent = req.headers['user-agent'] || 'Unknown Device'
    const ip = req.ip || req.socket.remoteAddress || 'Unknown IP'
    const { loginOrEmail, password } = req.body

    const deviceId = randomUUID()

    const result = await authService.login(loginOrEmail, password, userAgent, ip, deviceId)

    if (result.status !== ResultStatus.Success) {
      res.status(HTTP_STATUSES.UNAUTHORIZED_401).json({
        errorsMessages: result.extensions,
      })
      return
    }

    res.cookie('refreshToken', result.data!.refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: Number(REFRESH_TIME) * 1000,
      sameSite: 'strict',
    })

    res.status(HTTP_STATUSES.OK_200).send({ accessToken: result.data!.accessToken })
  }

  async passwordRecovery(req: Request, res: Response): Promise<void> {
    const { email } = req.body
    const result = await authService.passwordRecovery(email)

    if (result.status !== ResultStatus.Success) {
      res.status(HTTP_STATUSES.BAD_REQUEST_400).send({
        errorsMessages: result.extensions,
      })
      return
    }
    res.status(HTTP_STATUSES.NO_CONTENT_204).send()
  }

  async newPassword(req: Request, res: Response): Promise<void> {
    const { newPassword, recoveryCode } = req.body
    const result = await authService.newPassword(newPassword, recoveryCode)

    if (result.status !== ResultStatus.Success) {
      res.status(HTTP_STATUSES.BAD_REQUEST_400).send({
        errorsMessages: result.extensions,
      })
      return
    }
    res.status(HTTP_STATUSES.NO_CONTENT_204).send()
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    const oldRefreshToken = req.cookies?.refreshToken

    if (!oldRefreshToken) {
      res.status(HTTP_STATUSES.UNAUTHORIZED_401).json({ message: 'Refresh token missing' })
      return
    }

    const result = await authService.refreshToken(oldRefreshToken)

    if (result.status !== ResultStatus.Success) {
      res.status(HTTP_STATUSES.UNAUTHORIZED_401).json({
        message: result.errorMessage,
        extensions: result.extensions,
      })
      return
    }

    res.cookie('refreshToken', result.data?.refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: Number(REFRESH_TIME) * 1000,
      sameSite: 'strict',
    })

    res.status(HTTP_STATUSES.OK_200).json({ accessToken: result.data?.accessToken })
  }

  async logout(req: Request, res: Response): Promise<void> {
    const refreshToken = req.cookies?.refreshToken

    if (!refreshToken) {
      res.status(HTTP_STATUSES.UNAUTHORIZED_401).json({ message: 'Refresh token missing' })
      return
    }

    const result = await authService.logout(refreshToken)

    if (result.status !== ResultStatus.Success) {
      res.status(HTTP_STATUSES.UNAUTHORIZED_401).json({
        message: result.errorMessage,
        extensions: result.extensions,
      })
      return
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
    })

    res.status(HTTP_STATUSES.NO_CONTENT_204).send()
  }

  // TODO: Remove
  async me(req: Request, res: Response) {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(HTTP_STATUSES.UNAUTHORIZED_401).json({ message: 'Access token missing' })
      return
    }

    const accessToken = authHeader.split(' ')[1]
    const decoded = await jwtService.verifyAccessToken(accessToken)

    if (!decoded) {
      res
        .status(HTTP_STATUSES.UNAUTHORIZED_401)
        .json({ message: 'Invalid or expired access token' })
      return
    }

    const user = await usersRepository.findById(decoded.userId)
    if (!user) {
      res.status(HTTP_STATUSES.UNAUTHORIZED_401).json({ message: 'User not found' })
      return
    }

    res.status(HTTP_STATUSES.OK_200).json({
      userId: user._id.toString(),
      email: user.email,
      login: user.login,
    } as MeType)
  }
}

export const authController = new AuthController()

authRouter.post(
  '/login',
  countRequestsMiddleware,
  loginOrEmailValidation,
  passwordValidation,
  errorsResultMiddleware,
  authController.login,
)

authRouter.post(
  '/password-recovery',
  countRequestsMiddleware,
  emailValidation,
  errorsResultMiddleware,
  authController.passwordRecovery,
)

authRouter.post(
  '/new-password',
  countRequestsMiddleware,
  newPasswordValidation,
  errorsResultMiddleware,
  authController.newPassword,
)

authRouter.post(
  '/registration',
  countRequestsMiddleware,
  loginValidation,
  passwordValidation,
  emailValidation,
  errorsResultMiddleware,
  authController.registerUser,
)

authRouter.post(
  '/registration-confirmation',
  countRequestsMiddleware,
  errorsResultMiddleware,
  authController.registerConfirm,
)

authRouter.post(
  '/registration-email-resending',
  countRequestsMiddleware,
  isUserConfirmedByEmailValidation,
  errorsResultMiddleware,
  authController.registerEmailResending,
)

authRouter.get('/me', jwtAccessAuthMiddleware, authController.me)

authRouter.post('/refresh-token', jwtRefreshAuthMiddleware, authController.refreshToken)

authRouter.post('/logout', jwtRefreshAuthMiddleware, authController.logout)
