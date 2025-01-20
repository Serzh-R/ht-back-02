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

export type UserRegisterDBType = UserDBInsertType & { emailConfirmation: EmailConfirmationType }

export type EmailConfirmationType = {
  confirmationCode: string
  expirationDate: Date
  isConfirmed: boolean
}

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
