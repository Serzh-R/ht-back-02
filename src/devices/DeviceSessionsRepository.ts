import { deviceSessionsCollection } from '../db/mongoDb'
import { ObjectId } from 'mongodb'
import { DeviceSessionDBType } from './device-types'

export const deviceSessionsRepository = {
  async createDeviceSession(sessionData: DeviceSessionDBType) {
    try {
      await deviceSessionsCollection.insertOne(sessionData)
      return true
    } catch (error) {
      console.error('Error creating device session:', error)
      return false
    }
  },

  async findCurrentDevice(userId: string, deviceId: string) {
    return await deviceSessionsCollection.findOne({
      userId,
      deviceId,
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
