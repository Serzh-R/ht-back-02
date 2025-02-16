import { sessionCollection } from '../db/mongoDb'
import { ObjectId } from 'mongodb'

export const devicesService = {
  async deleteDevicesByUserIdExceptCurrent(
    userId: string,
    currentRefreshToken: string,
  ): Promise<boolean> {
    const currentDevice = await sessionCollection.findOne({
      userId: new ObjectId(userId),
      refreshToken: currentRefreshToken,
    })
    if (!currentDevice) return false

    await sessionCollection.deleteMany({
      userId: new ObjectId(userId),
      _id: { $ne: new ObjectId(currentDevice._id) },
    })

    return true
  },

  async deleteDeviceById(userId: string, deviceId: string) {
    const result = await sessionCollection.deleteOne({ userId: new ObjectId(userId), deviceId })
    return result.deletedCount > 0
  },
}
