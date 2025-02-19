import { ObjectId } from 'mongodb'

export type DeviceSessionDBType = {
  _id?: ObjectId
  ip: string
  title: string
  lastActiveDate: number
  expirationDate: number
  deviceId: string
  userId: string
}

export type DeviceSessionType = {
  ip: string
  title: string // Название устройства (User-Agent или значение по умолчанию)
  lastActiveDate: string // Дата последней генерации refresh/access токенов (ISO строка)
  deviceId: string // ID сессии устройства, хранится в refreshToken
}

export type AppealToApi = {
  ip: string
  url: string
  date: Date
}
