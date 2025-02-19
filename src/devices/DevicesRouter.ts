import { Router, Request, Response } from 'express'
import { HTTP_STATUSES } from '../settings'
import { devicesService } from './DevicesService'
import { idParamValidator } from '../validation/express-validator/field.validators'
import { devicesQueryRepository } from './DevicesQueryRepository'
import { jwtRefreshTokenMiddleware } from '../auth/middlewares/jwtRefreshToken.middleware'

export const devicesRouter = Router()

export const devicesController = {
  async getDevicesByUserId(req: Request, res: Response) {
    const userId = req.userId

    if (!userId) {
      res.status(HTTP_STATUSES.UNAUTHORIZED_401).json({ message: 'Unauthorized' })
      return
    }

    const devices = await devicesQueryRepository.getDevicesByUserId(userId)
    res.status(HTTP_STATUSES.OK_200).json(devices)
  },

  async deleteDevicesByUserIdExceptCurrent(req: Request, res: Response) {
    const userId = req.userId

    if (!userId) {
      res.status(HTTP_STATUSES.UNAUTHORIZED_401).json({ message: 'Unauthorized' })
      return
    }

    const isDeleted = await devicesService.deleteDevicesByUserIdExceptCurrent(
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

    const device = await devicesService.deviceBySessionId(deviceId)

    if (!device) {
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

    await devicesService.deleteDeviceById(deviceId)

    res.status(HTTP_STATUSES.NO_CONTENT_204).send()
  },
}

devicesRouter.get('/', jwtRefreshTokenMiddleware, devicesController.getDevicesByUserId)

devicesRouter.delete(
  '/',
  jwtRefreshTokenMiddleware,
  devicesController.deleteDevicesByUserIdExceptCurrent,
)

devicesRouter.delete(
  '/:id',
  jwtRefreshTokenMiddleware,
  idParamValidator,
  devicesController.deleteDeviceBySessionId,
)
