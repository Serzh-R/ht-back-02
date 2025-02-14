import { Router, Request, Response } from 'express'
import { HTTP_STATUSES } from '../settings'
import { jwtAuthMiddleware } from '../auth/middlewares/jwt.auth.middleware'
import { devicesService } from './DevicesService'

export const devicesRouter = Router()

export const devicesController = {
  // Получение всех устройств пользователя
  async getDevices(req: Request, res: Response) {
    const userId = req.userId
    const devices = await devicesService.getDevicesByUserId(userId)
    res.status(HTTP_STATUSES.OK_200).json(devices)
  },

  // Удаление всех устройств пользователя (кроме текущего)
  async deleteDevices(req: Request, res: Response) {
    const userId = req.userId
    const isDeleted = await devicesService.deleteAllDevicesExceptCurrent(
      userId,
      req.cookies.refreshToken,
    )
    if (!isDeleted) {
      return res.status(HTTP_STATUSES.UNAUTHORIZED_401).json({ message: 'Unauthorized' })
    }
    res.status(HTTP_STATUSES.NO_CONTENT_204).send()
  },

  // Удаление конкретного устройства
  async deleteDeviceById(req: Request, res: Response) {
    const userId = req.userId
    const { deviceId } = req.params

    const isDeleted = await devicesService.deleteDeviceById(userId, deviceId)
    if (!isDeleted) {
      return res
        .status(HTTP_STATUSES.NOT_FOUND_404)
        .json({ message: 'Device not found or access denied' })
    }
    res.status(HTTP_STATUSES.NO_CONTENT_204).send()
  },
}

devicesRouter.get('/', jwtAuthMiddleware, devicesController.getDevices)

devicesRouter.delete('/', jwtAuthMiddleware, devicesController.deleteDevices)

devicesRouter.delete('/:id', jwtAuthMiddleware, devicesController.deleteDeviceById)
