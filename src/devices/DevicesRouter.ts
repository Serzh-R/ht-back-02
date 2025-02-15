import { Router, Request, Response } from 'express'
import { HTTP_STATUSES } from '../settings'
import { jwtAuthMiddleware } from '../auth/middlewares/jwt.auth.middleware'
import { devicesService } from './DevicesService'
import { idParamValidator } from '../validation/express-validator/field.validators'
import { devicesQueryRepository } from './DevicesQueryRepository'

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

  async deleteDeviceById(req: Request, res: Response) {
    const userId = req.userId
    const { deviceId } = req.params

    if (!userId) {
      res.status(HTTP_STATUSES.UNAUTHORIZED_401).json({ message: 'Unauthorized' })
      return
    }

    const isDeleted = await devicesService.deleteDeviceById(userId, deviceId)
    if (!isDeleted) {
      res.status(HTTP_STATUSES.NOT_FOUND_404).json({ message: 'Device not found or access denied' })
      return
    }
    res.status(HTTP_STATUSES.NO_CONTENT_204).send()
  },
}

devicesRouter.get('/', jwtAuthMiddleware, devicesController.getDevicesByUserId)

devicesRouter.delete('/', jwtAuthMiddleware, devicesController.deleteDevicesByUserIdExceptCurrent)

devicesRouter.delete(
  '/:id',
  jwtAuthMiddleware,
  idParamValidator,
  devicesController.deleteDeviceById,
)
