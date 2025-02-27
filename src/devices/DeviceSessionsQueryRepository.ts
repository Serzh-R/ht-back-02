import { DeviceSession, DeviceSessionDB } from './device-types'
import { deviceSessionsCollection } from '../db/mongoDb'
import { WithId } from 'mongodb'

class DeviceSessionsQueryRepository {
  async getDevicesByUserId(userId: string): Promise<DeviceSession[]> {
    const devices = await deviceSessionsCollection
      .find({
        userId,
      })
      .toArray()

    return devices.map(
      (device: WithId<DeviceSessionDB>): DeviceSession => ({
        ip: device.ip,
        title: device.title,
        lastActiveDate: new Date(device.lastActiveDate).toISOString(),
        deviceId: device.deviceId,
      }),
    )
  }
}

export const deviceSessionsQueryRepository = new DeviceSessionsQueryRepository()
