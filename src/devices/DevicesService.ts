import { deviceSessionsCollection } from '../db/mongoDb'
import { ObjectId } from 'mongodb'
import { DeviceSessionDBType, DeviceSessionType } from './types'
import { HTTP_STATUSES } from '../settings'
import { Result } from '../common/result/result.type'
import { ResultStatus } from '../common/result/resultCode'

export const devicesService = {
  async deleteDevicesByUserIdExceptCurrent(
    userId: string,
    currentRefreshToken: string,
  ): Promise<boolean> {
    const currentDevice = await deviceSessionsCollection.findOne({
      userId,
      refreshToken: currentRefreshToken,
    })
    if (!currentDevice) return false

    await deviceSessionsCollection.deleteMany({
      userId,
      _id: { $ne: new ObjectId(currentDevice._id) },
    })

    return true
  },

  async deviceByDeviceId(userId: string, deviceId: string): Promise<Result<DeviceSessionDBType>> {
    const device = await deviceSessionsCollection.findOne({ userId, deviceId })

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

  async deleteDeviceById(userId: string, deviceId: string): Promise<boolean> {
    const result = await deviceSessionsCollection.deleteOne({
      userId,
      deviceId,
    })
    return result.deletedCount > 0
  },
}
