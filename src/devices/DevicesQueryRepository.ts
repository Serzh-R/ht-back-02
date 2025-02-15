import { DevicesDBType, DeviceType } from './types'
import { devicesCollection } from '../db/mongoDb'
import { ObjectId } from 'mongodb'

export const devicesQueryRepository = {
  async getDevicesByUserId(userId: string): Promise<DeviceType[]> {
    const devices = await devicesCollection.find({ userId: new ObjectId(userId) }).toArray()

    return devices.map(
      (device: DevicesDBType): DeviceType => ({
        ip: device.ip,
        title: device.title,
        lastActiveDate: device.lastActiveDate.toISOString(),
        deviceId: device.deviceId,
      }),
    )
  },
}
