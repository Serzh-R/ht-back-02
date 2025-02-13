import { devicesCollection } from '../db/mongoDb'
import { ObjectId } from 'mongodb'

export const devicesService = {
  async getDevicesByUserId(userId: string) {
    return await devicesCollection.find({ userId }).toArray()
  },

  async deleteAllDevicesExceptCurrent(userId: string, currentRefreshToken: string) {
    const currentDevice = await devicesCollection.findOne({
      userId,
      refreshToken: currentRefreshToken,
    })
    if (!currentDevice) return false

    await devicesCollection.deleteMany({
      userId,
      _id: { $ne: new ObjectId(currentDevice._id) },
    })

    return true
  },

  async deleteDeviceById(userId: string, deviceId: string) {
    const result = await devicesCollection.deleteOne({ userId, deviceId })
    return result.deletedCount > 0
  },
}
