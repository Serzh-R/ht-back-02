import { DeviceSessionDB } from './device-session-types'
import { Result } from '../common/result/result.type'
import { ResultStatus } from '../common/result/resultCode'
import { deviceSessionsRepository } from './DeviceSessionsRepository'
import { DeviceSessionModel } from './device-session-schema'
import { WithId } from 'mongodb'

class DeviceSessionsService {
  async deleteDevicesByUserIdExceptCurrent(
    userId: string,
    currentDeviceId: string,
  ): Promise<boolean> {
    const currentDevice = await deviceSessionsRepository.findCurrentDevice(userId, currentDeviceId)
    if (!currentDevice) return false

    return await deviceSessionsRepository.deleteDevicesExceptCurrent(userId, currentDeviceId)
  }

  async deviceBySessionId(deviceId: string): Promise<Result<WithId<DeviceSessionDB>>> {
    const device = await DeviceSessionModel.findOne({ deviceId }).lean()

    if (!device) {
      return {
        status: ResultStatus.NotFound,
        errorMessage: 'No device found',
        extensions: [{ field: 'device', message: 'Device not found' }],
        data: null,
      }
    }

    return {
      status: ResultStatus.Success,
      data: device,
      extensions: [],
    }
  }

  async deleteDeviceById(deviceId: string): Promise<boolean> {
    const result = await DeviceSessionModel.deleteOne({ deviceId })
    return result.deletedCount > 0
  }
}

export const deviceSessionsService = new DeviceSessionsService()

// ********************************************************** //

/*
import { deviceSessionsCollection } from '../db/mongoDb'
import { ObjectId, WithId } from 'mongodb'
import { DeviceSessionDB } from './device-session-types'
import { Result } from '../common/result/result.type'
import { ResultStatus } from '../common/result/resultCode'
import { deviceSessionsRepository } from './DeviceSessionsRepository'

class DeviceSessionsService {
  async deleteDevicesByUserIdExceptCurrent(
    userId: string,
    currentDeviceId: string,
  ): Promise<boolean> {
    const currentDevice = await deviceSessionsRepository.findCurrentDevice(userId, currentDeviceId)
    if (!currentDevice) return false

    const isDeleted = await deviceSessionsRepository.deleteDevicesExceptCurrent(
      userId,
      new ObjectId(currentDevice._id),
    )

    return isDeleted
  }

  async deviceBySessionId(deviceId: string): Promise<Result<WithId<DeviceSessionDB>>> {
    const device = await deviceSessionsCollection.findOne({ deviceId })

    if (!device) {
      return {
        status: ResultStatus.NotFound,
        errorMessage: 'No device found',
        extensions: [{ field: 'device', message: 'Device not found' }],
        data: null,
      }
    }

    return {
      status: ResultStatus.Success,
      data: device,
      extensions: [],
    }
  }

  async deleteDeviceById(deviceId: string): Promise<boolean> {
    const result = await deviceSessionsCollection.deleteOne({ deviceId })
    return result.deletedCount > 0
  }
}

export const deviceSessionsService = new DeviceSessionsService()
*/
