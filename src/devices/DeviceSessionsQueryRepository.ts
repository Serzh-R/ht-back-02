import { DeviceSession } from './device-session-types'
import { DeviceSessionModel } from './device-session-schema'

class DeviceSessionsQueryRepository {
  async getDevicesByUserId(userId: string): Promise<DeviceSession[]> {
    const devices = await DeviceSessionModel.find({ userId })
      .select('ip title lastActiveDate deviceId')
      .lean()

    return devices.map((device) => ({
      ip: device.ip,
      title: device.title,
      lastActiveDate: new Date(device.lastActiveDate).toISOString(),
      deviceId: device.deviceId,
    }))
  }
}

export const deviceSessionsQueryRepository = new DeviceSessionsQueryRepository()

// ************************************************************************ //

/*
import { DeviceSession, DeviceSessionDB } from './device-session-types'
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
*/
