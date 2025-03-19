import { HydratedDocument, model, Model, Schema } from 'mongoose'
import { BlacklistDB, EmailConfirmation, PasswordRecovery, UserRegDB } from './user-types'

type UserModelType = Model<UserRegDB>

export type UserDocument = HydratedDocument<UserRegDB>

const EmailConfirmationSchema = new Schema<EmailConfirmation>(
  {
    confirmationCode: { type: String, nullable: true },
    expirationDate: { type: Date, nullable: true },
    isConfirmed: { type: Boolean, required: true, default: true, nullable: false },
  },
  { _id: false, id: false },
)

const PasswordRecoverySchema = new Schema<PasswordRecovery>(
  {
    passwordRecoveryCode: { type: String, required: true },
    expirationDate: { type: Date, required: true },
  },
  { _id: false, id: false },
)

const userSchema = new Schema<UserRegDB>({
  _id: { type: Schema.Types.ObjectId, auto: true },
  login: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  emailConfirmation: { type: EmailConfirmationSchema, required: true },
  passwordRecovery: { type: PasswordRecoverySchema, default: null },
})

export const UserModel = model<UserRegDB, UserModelType>('users', userSchema)

// **************************************************************************** //

type BlackListModelType = Model<BlacklistDB>

export type BlackListDocument = HydratedDocument<BlacklistDB>

const blacklistSchema = new Schema<BlacklistDB>({
  _id: { type: Schema.Types.ObjectId, auto: true },
  refreshToken: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

export const BlacklistModel = model<BlacklistDB, BlackListModelType>('blacklist', blacklistSchema)
