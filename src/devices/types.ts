export type DevicesDBType = {
  _id: ObjectId
  userId: string
  deviceId: string
  ip: string
  lastActiveDate: Date
  userAgent: string // Информация о браузере/устройстве
}
