import { ObjectId } from 'mongodb'

export type UserType = {
  id: string
  login: string
  email: string
  createdAt: string
}

export type UserDBType = {
  _id: ObjectId
  login: string
  email: string
  passwordHash: string
  createdAt: Date
}

export type UserDBInsertType = Omit<UserDBType, '_id'>

export type UserRegDBType = UserDBType & { emailConfirmation: EmailConfirmationType }

export type UserRegInsertDBType = UserDBInsertType & { emailConfirmation: EmailConfirmationType }

export type EmailConfirmationType = {
  confirmationCode: string
  expirationDate: Date
  isConfirmed: boolean
}

/*export type UserAccountDBType = WithId<{
  accountData: UserAccountType
  emailConfirmation: EmailConfirmationType
}>

export type UserAccountType = {
  email: string
  login: string
  passwordHash: string
  createdAt: Date
}*/

export type PaginatorUserType = {
  pagesCount: number
  page: number
  pageSize: number
  totalCount: number
  items: UserType[]
}

export type UserInputType = {
  login: string
  password: string
  email: string
}

export type LoginOrEmailInputType = {
  loginOrEmail: string
  password: string
}

export type BlacklistType = {
  id: string
  refreshToken: string
  createdAt: string
}

export type BlacklistDBType = {
  _id: ObjectId
  refreshToken: string
  createdAt: Date
}

export type MeType = {
  email: string
  login: string
  userId: string
}
