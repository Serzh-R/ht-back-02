import { HydratedDocument, model, Model, Schema } from 'mongoose'
import { EmailConfirmation, PasswordRecovery, UserRegDB } from './user-types'

type UserModel = Model<UserRegDB>

export type UserDocument = HydratedDocument<UserRegDB>

const EmailConfirmationSchema = new Schema<EmailConfirmation>({
  confirmationCode: { type: String, required: true },
  expirationDate: { type: Date, required: true },
  isConfirmed: { type: Boolean, required: true, default: false },
})

const PasswordRecoverySchema = new Schema<PasswordRecovery>({
  passwordRecoveryCode: { type: String, required: true },
  expirationDate: { type: Date, required: true },
})

const userSchema = new Schema<UserRegDB>({
  _id: { type: Schema.Types.ObjectId, auto: true },
  login: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, required: true },
  emailConfirmation: { type: EmailConfirmationSchema, required: true },
  passwordRecovery: { type: PasswordRecoverySchema, default: null },
})

export const UserModel = model<UserRegDB, UserModel>('users', userSchema)
