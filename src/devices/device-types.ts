export class DeviceSessionDB {
  constructor(
    public ip: string,
    public title: string,
    public lastActiveDate: number,
    public expirationDate: number,
    public deviceId: string,
    public userId: string,
  ) {}
}

export class DeviceSession {
  constructor(
    public ip: string,
    public title: string, // Название устройства (User-Agent или значение по умолчанию)
    public lastActiveDate: string,
    public deviceId: string,
  ) {}
}

// Класс для обращения к API
export class AppealToApi {
  constructor(
    public ip: string,
    public url: string,
    public date: Date,
  ) {}
}

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

// export type DeviceSessionDBType = {
//   _id?: ObjectId
//   ip: string
//   title: string
//   lastActiveDate: number
//   expirationDate: number
//   deviceId: string
//   userId: string
// }

// export type DeviceSessionType = {
//   ip: string
//   title: string // Название устройства (User-Agent или значение по умолчанию)
//   lastActiveDate: string
//   deviceId: string
// }

// export type AppealToApi = {
//   ip: string
//   url: string
//   date: Date
// }
