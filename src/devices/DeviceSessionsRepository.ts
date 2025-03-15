import { WithId } from 'mongodb'
import { DeviceSessionDB } from './device-session-types'
import { DeviceSessionModel } from './device-session-schema'

class DeviceSessionsRepository {
  async createDeviceSession(sessionData: WithId<DeviceSessionDB>): Promise<boolean> {
    await DeviceSessionModel.create(sessionData)
    return true
  }

  async findCurrentDevice(userId: string, deviceId: string): Promise<DeviceSessionDB | null> {
    return await DeviceSessionModel.findOne({ userId, deviceId }).lean()
  }

  async deleteDevicesExceptCurrent(userId: string, currentDeviceId: string): Promise<boolean> {
    const result = await DeviceSessionModel.deleteMany({
      userId,
      _id: { $ne: currentDeviceId },
    })
    return result.deletedCount > 0
  }

  async deleteDeviceSessions(deviceId: string, userId: string): Promise<boolean> {
    const result = await DeviceSessionModel.deleteMany({ deviceId, userId })
    return result.deletedCount > 0
  }

  async findSessionByDeviceIdAndUserId(
    deviceId: string,
    userId: string,
  ): Promise<WithId<DeviceSessionDB> | null> {
    return (await DeviceSessionModel.findOne({
      deviceId,
      userId,
    }).lean()) as WithId<DeviceSessionDB> | null
  }

  async updateSessionDates(
    deviceId: string,
    userId: string,
    lastActiveDate: number,
    expirationDate: number,
  ): Promise<boolean> {
    const result = await DeviceSessionModel.updateOne(
      { deviceId, userId },
      { $set: { lastActiveDate, expirationDate } },
    )
    return result.modifiedCount > 0
  }
}

export const deviceSessionsRepository = new DeviceSessionsRepository()

// *********************************************************************** //

/*
import { deviceSessionsCollection } from '../db/mongoDb'
import { ObjectId, WithId } from 'mongodb'
import { DeviceSessionDB } from './device-session-types'

class DeviceSessionsRepository {
  async createDeviceSession(sessionData: WithId<DeviceSessionDB>) {
    try {
      await deviceSessionsCollection.insertOne(sessionData)
      return true
    } catch (error) {
      console.error('Error creating device session:', error)
      return false
    }
  }

  async findCurrentDevice(userId: string, deviceId: string) {
    return await deviceSessionsCollection.findOne({
      userId,
      deviceId,
    })
  }

  async deleteDevicesExceptCurrent(userId: string, currentDeviceId: ObjectId) {
    const result = await deviceSessionsCollection.deleteMany({
      userId,
      _id: { $ne: currentDeviceId },
    })
    return result.deletedCount > 0
  }

  async deleteDeviceSessions({ deviceId, userId }: { deviceId: string; userId: string }) {
    const result = await deviceSessionsCollection.deleteMany({
      deviceId,
      userId,
    })

    return result.deletedCount > 0
  }

  async findSessionByDeviceIdAndUserId(deviceId: string, userId: string) {
    return await deviceSessionsCollection.findOne({
      deviceId,
      userId,
    })
  }

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
  }
}

export const deviceSessionsRepository = new DeviceSessionsRepository()
*/
