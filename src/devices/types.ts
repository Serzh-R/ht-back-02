export type DevicesDBType = {
  _id: ObjectId
  ip: string
  title: string // Информация о браузере/устройстве
  lastActiveDate: Date
  deviceId: string
  userId: string
}

export type DeviceType = {
  ip: string
  title: string // Название устройства (User-Agent)
  lastActiveDate: string // Дата последней генерации refresh/access токенов (ISO строка)
  deviceId: string
}
