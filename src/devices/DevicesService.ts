import { deviceSessionsCollection } from '../db/mongoDb'
import { ObjectId } from 'mongodb'
import { DeviceSessionDBType } from './types'
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
