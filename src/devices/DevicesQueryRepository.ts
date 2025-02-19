import { DeviceSessionDBType, DeviceSessionType } from './types'
import { deviceSessionsCollection } from '../db/mongoDb'

export const devicesQueryRepository = {
  async getDevicesByUserId(userId: string): Promise<DeviceSessionType[]> {
    const devices = await deviceSessionsCollection.find({ userId }).toArray()

    return devices.map(
      (device: DeviceSessionDBType): DeviceSessionType => ({
        ip: device.ip,
        title: device.title,
        lastActiveDate: new Date(device.lastActiveDate).toISOString(),
        deviceId: device.deviceId,
      }),
    )
  },
}
