import { ObjectId } from 'mongodb'

export type DevicesDBType = {
  _id?: ObjectId
  ip: string
  title: string
  lastActiveDate: Date
  expirationDate: Date
  deviceId: string
  userId: ObjectId
}

export type DeviceType = {
  ip: string
  title: string // Название устройства (User-Agent или значение по умолчанию)
  lastActiveDate: string // Дата последней генерации refresh/access токенов (ISO строка)
  expirationDate: string // Дата окончания действия refreshToken (ISO строка)
  deviceId: string // ID сессии устройства, хранится в refreshToken
}

export type AppealToApi = {
  IP: string
  URL: string
  date: Date
}
