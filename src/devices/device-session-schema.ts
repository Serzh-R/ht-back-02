import { HydratedDocument, model, Model, Schema } from 'mongoose'
import { DeviceSessionDB } from './device-session-types'

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
