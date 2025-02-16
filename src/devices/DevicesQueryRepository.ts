import { SessionDBType, SessionType } from './types'
import { sessionCollection } from '../db/mongoDb'
import { ObjectId } from 'mongodb'

export const devicesQueryRepository = {
  async getDevicesByUserId(userId: string): Promise<SessionType[]> {
    const devices = await sessionCollection.find({ userId: new ObjectId(userId) }).toArray()

    return devices.map(
      (device: SessionDBType): SessionType => ({
        ip: device.ip,
        title: device.title,
        lastActiveDate: device.lastActiveDate.toISOString(),
        deviceId: device.deviceId,
      }),
    )
  },
}
