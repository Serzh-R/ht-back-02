import { deviceSessionsCollection } from '../db/mongoDb'
import { ObjectId } from 'mongodb'
import { DeviceSessionDBType } from './types'
import { Result } from '../common/result/result.type'
import { ResultStatus } from '../common/result/resultCode'
import { deviceSessionsRepository } from './DeviceSessionsRepository'

export const deviceSessionsService = {
  async deleteDevicesByUserIdExceptCurrent(
    userId: string,
    currentRefreshToken: string,
  ): Promise<boolean> {
    const currentDevice = await deviceSessionsRepository.findCurrentDevice(
      userId,
      currentRefreshToken,
    )
    if (!currentDevice) return false

    const isDeleted = await deviceSessionsRepository.deleteDevicesExceptCurrent(
      userId,
      new ObjectId(currentDevice._id),
    )

    return isDeleted
  },

  async deviceBySessionId(deviceId: string): Promise<Result<DeviceSessionDBType>> {
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
  },

  async deleteDeviceById(deviceId: string): Promise<boolean> {
    const result = await deviceSessionsCollection.deleteOne({ deviceId })
    return result.deletedCount > 0
  },
}
