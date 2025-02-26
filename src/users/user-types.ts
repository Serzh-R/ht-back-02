import { ObjectId } from 'mongodb'

export class UserType {
  constructor(
    public id: string,
    public login: string,
    public email: string,
    public createdAt: string,
  ) {}
}

// ****************************************************************** //

export class UserDBType {
  constructor(
    public _id: ObjectId,
    public login: string,
    public email: string,
    public passwordHash: string,
    public createdAt: Date,
  ) {}
}

// ****************************************************************** //

// UserDBInsertType — тип для вставки пользователя в базу данных без _id
export class UserDBInsertType {
  public login: string
  public email: string
  public passwordHash: string
  public createdAt: Date

  constructor(user: UserDBType) {
    this.login = user.login
    this.email = user.email
    this.passwordHash = user.passwordHash
    this.createdAt = user.createdAt
  }
}

// ****************************************************************** //

// UserRegDBType — модель регистрации пользователя в базе данных с подтверждением почты
export class UserRegDBType {
  constructor(
    public _id: ObjectId,
    public login: string,
    public email: string,
    public passwordHash: string,
    public createdAt: Date,
    public emailConfirmation: EmailConfirmationType,
    public passwordRecovery: PasswordRecovery | null,
  ) {}
}

// ********************************************************** //

// UserRegInsertDBType — модель вставки пользователя в базу данных с подтверждением почты
export class UserRegInsertDBType {
  public login: string
  public email: string
  public passwordHash: string
  public createdAt: Date
  public emailConfirmation: EmailConfirmationType

  constructor(user: {
    login: string
    email: string
    passwordHash: string
    createdAt: Date
    emailConfirmation: EmailConfirmationType
  }) {
    this.login = user.login
    this.email = user.email
    this.passwordHash = user.passwordHash
    this.createdAt = user.createdAt
    this.emailConfirmation = user.emailConfirmation
  }
}

// ****************************************************************** //

export class EmailConfirmationType {
  constructor(
    public confirmationCode: string,
    public expirationDate: Date,
    public isConfirmed: boolean,
  ) {}
}

export class PasswordRecovery {
  constructor(
    public passwordRecoveryCode: string,
    public expirationDate: Date,
  ) {}
}

// ****************************************************************** //

export class PaginatorUserType {
  constructor(
    public pagesCount: number,
    public page: number,
    public pageSize: number,
    public totalCount: number,
    public items: UserType[], // Заменяем UserDBType на UserType
  ) {}
}

// ****************************************************************** //

export class UserInputType {
  constructor(
    public login: string,
    public password: string,
    public email: string,
  ) {}
}

// ****************************************************************** //

export class BlacklistDBType {
  constructor(
    public _id: ObjectId,
    public refreshToken: string,
    public createdAt: Date,
  ) {}
}

// ****************************************************************** //

export class MeType {
  constructor(
    public email: string,
    public login: string,
    public userId: string,
  ) {}
}

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

// export type UserType = {
//   id: string
//   login: string
//   email: string
//   createdAt: string
// }

//************************************************************

// export type UserDBType = {
//   _id: ObjectId
//   login: string
//   email: string
//   passwordHash: string
//   createdAt: Date
// }

//************************************************************

//export type UserDBInsertType = Omit<UserDBType, '_id'>

//************************************************************

//export type UserRegDBType = UserDBType & { emailConfirmation: EmailConfirmationType }

//************************************************************

//export type UserRegInsertDBType = UserDBInsertType & { emailConfirmation: EmailConfirmationType }

//************************************************************

// export type EmailConfirmationType = {
//   confirmationCode: string
//   expirationDate: Date
//   isConfirmed: boolean
// }

//*************************************************************

// export type PaginatorUserType = {
//   pagesCount: number
//   page: number
//   pageSize: number
//   totalCount: number
//   items: UserType[]
// }

//*************************************************************

// export type UserInputType = {
//   login: string
//   password: string
//   email: string
// }

//*************************************************************

// export type BlacklistDBType = {
//   _id: ObjectId
//   refreshToken: string
//   createdAt: Date
// }

//*************************************************************

// export type MeType = {
//   email: string
//   login: string
//   userId: string
// }

//**************************************************************

// export type LoginOrEmailInputType = {
//   loginOrEmail: string
//   password: string
// }

// export type BlacklistType = {
//   id: string
//   refreshToken: string
//   createdAt: string
// }
