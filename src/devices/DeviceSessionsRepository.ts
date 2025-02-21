import { deviceSessionsCollection } from '../db/mongoDb'
import { ObjectId } from 'mongodb'

export const deviceSessionsRepository = {
  async findCurrentDevice(userId: string, currentRefreshToken: string) {
    return await deviceSessionsCollection.findOne({
      userId,
      refreshToken: currentRefreshToken,
    })
  },

  async deleteDevicesExceptCurrent(userId: string, currentDeviceId: ObjectId) {
    const result = await deviceSessionsCollection.deleteMany({
      userId,
      _id: { $ne: currentDeviceId },
    })
    return result.deletedCount > 0
  },

  async deleteDeviceSessions({ deviceId, userId }: { deviceId: string; userId: string }) {
    // Удаляем все сессии устройства для данного пользователя
    const result = await deviceSessionsCollection.deleteMany({
      deviceId,
      userId,
    })

    return result.deletedCount > 0
  },

  async findSessionByDeviceIdAndUserId(deviceId: string, userId: string) {
    return await deviceSessionsCollection.findOne({
      deviceId,
      userId,
    })
  },

  async updateSessionDates(
    deviceId: string,
    userId: string,
    lastActiveDate: number,
    expirationDate: number,
  ) {
    const result = await deviceSessionsCollection.updateOne(
      { deviceId, userId },
      {
        $set: {
          lastActiveDate: lastActiveDate * 1000,
          expirationDate: expirationDate * 1000,
        },
      },
    )
    return result.modifiedCount > 0
  },
}
