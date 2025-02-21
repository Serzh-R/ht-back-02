import { Router, Request, Response } from 'express'
import { HTTP_STATUSES } from '../settings'
import { deviceSessionsService } from './DeviceSessionsService'
import { idParamValidator } from '../validation/express-validator/field.validators'
import { deviceSessionsQueryRepository } from './DeviceSessionsQueryRepository'
import { jwtRefreshAuthMiddleware } from '../auth/middlewares/jwt.refresh.auth.middleware'

export const deviceSessionsRouter = Router()

export const devicesController = {
  async getDevicesByUserId(req: Request, res: Response) {
    const userId = req.userId

    if (!userId) {
      res.status(HTTP_STATUSES.UNAUTHORIZED_401).json({ message: 'Unauthorized' })
      return
    }

    const devices = await deviceSessionsQueryRepository.getDevicesByUserId(userId)
    res.status(HTTP_STATUSES.OK_200).json(devices)
  },

  async deleteDevicesByUserIdExceptCurrent(req: Request, res: Response) {
    const userId = req.userId

    if (!userId) {
      res.status(HTTP_STATUSES.UNAUTHORIZED_401).json({ message: 'Unauthorized' })
      return
    }

    const isDeleted = await deviceSessionsService.deleteDevicesByUserIdExceptCurrent(
      userId,
      req.cookies.refreshToken,
    )
    if (!isDeleted) {
      res.status(HTTP_STATUSES.UNAUTHORIZED_401).json({ message: 'Unauthorized' })
      return
    }
    res.status(HTTP_STATUSES.NO_CONTENT_204).send()
  },

  async deleteDeviceBySessionId(req: Request, res: Response) {
    const userId = req.userId
    const { deviceId } = req.params

    if (!userId) {
      res.status(HTTP_STATUSES.UNAUTHORIZED_401).json({ message: 'Unauthorized' })
      return
    }

    const device = await deviceSessionsService.deviceBySessionId(deviceId)

    if (!device.data) {
      res.status(HTTP_STATUSES.NOT_FOUND_404).json({
        errorsMessages: [{ field: 'device', message: 'Device not found' }],
      })
      return
    }

    if (device.data?.userId !== userId) {
      res.status(HTTP_STATUSES.FORBIDDEN_403).json({
        errorsMessages: [
          { field: 'authorization', message: 'You do not have permission to delete this device' },
        ],
      })
      return
    }

    const deviceDeletionResult = await deviceSessionsService.deleteDeviceById(deviceId)

    if (!deviceDeletionResult) {
      res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)
      return
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  },
}

deviceSessionsRouter.get('/', jwtRefreshAuthMiddleware, devicesController.getDevicesByUserId)

deviceSessionsRouter.delete(
  '/',
  jwtRefreshAuthMiddleware,
  devicesController.deleteDevicesByUserIdExceptCurrent,
)

deviceSessionsRouter.delete(
  '/:deviceId',
  jwtRefreshAuthMiddleware,
  idParamValidator,
  devicesController.deleteDeviceBySessionId,
)
