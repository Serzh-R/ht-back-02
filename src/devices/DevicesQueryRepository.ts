import { DeviceSessionDBType, DeviceSessionType } from './types'
import { deviceSessionsCollection } from '../db/mongoDb'
import { ObjectId } from 'mongodb'

export const devicesQueryRepository = {
  async getDevicesByUserId(userId: string): Promise<DeviceSessionType[]> {
    const devices = await deviceSessionsCollection.find({ userId: new ObjectId(userId) }).toArray()

    return devices.map(
      (device: DeviceSessionDBType): DeviceSessionType => ({
        ip: device.ip,
        title: device.title,
        lastActiveDate: device.lastActiveDate.toISOString(),
        deviceId: device.deviceId,
      }),
    )
  },
}
