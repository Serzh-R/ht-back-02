import { DeviceSessionDBType, DeviceSessionType } from './types'
import { deviceSessionsCollection } from '../db/mongoDb'

export const deviceSessionsQueryRepository = {
  async getDevicesByUserId(userId: string): Promise<DeviceSessionType[]> {
    const currentTime = Date.now()

    // ✅ Фильтруем только активные устройства
    const devices = await deviceSessionsCollection
      .find({
        userId,
        expirationDate: { $gt: currentTime }, // Сессии, которые ещё не истекли
      })
      .toArray()

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
