import { HydratedDocument, model, Model, Schema } from 'mongoose'
import { AppealToApi, DeviceSessionDB } from './device-session-types'

type DeviceSessionModelType = Model<DeviceSessionDB>
export type DeviceSessionDocument = HydratedDocument<DeviceSessionDB>

const deviceSessionSchema = new Schema<DeviceSessionDB>({
  ip: { type: String, required: true },
  title: { type: String, required: true },
  lastActiveDate: { type: Number, required: true },
  expirationDate: { type: Number, required: true },
  deviceId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
})

export const DeviceSessionModel = model<DeviceSessionDB, DeviceSessionModelType>(
  'sessions',
  deviceSessionSchema,
)

// ************************************************************ //

type AppealModelType = Model<AppealToApi>
export type AppealDocument = HydratedDocument<AppealToApi>

const appealSchema = new Schema<AppealToApi>({
  ip: { type: String, required: true },
  url: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now },
})

export const AppealModel = model<AppealToApi, AppealModelType>('requests', appealSchema)
