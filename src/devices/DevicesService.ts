import { devicesCollection } from '../db/mongoDb'
import { ObjectId } from 'mongodb'
import { devicesQueryRepository } from './DevicesQueryRepository'

export const devicesService = {
  async deleteDevicesByUserIdExceptCurrent(
    userId: string,
    currentRefreshToken: string,
  ): Promise<boolean> {
    const currentDevice = await devicesCollection.findOne({
      userId: new ObjectId(userId),
      refreshToken: currentRefreshToken,
    })
    if (!currentDevice) return false

    await devicesCollection.deleteMany({
      userId: new ObjectId(userId),
      _id: { $ne: new ObjectId(currentDevice._id) },
    })

    return true
  },

  async deleteDeviceById(userId: string, deviceId: string) {
    const result = await devicesCollection.deleteOne({ userId: new ObjectId(userId), deviceId })
    return result.deletedCount > 0
  },
}
