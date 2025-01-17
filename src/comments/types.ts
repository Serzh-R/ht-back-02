import { ObjectId } from 'mongodb'

export type CommentInputType = {
  content: string // maxLength: 300   minLength: 20
}

export type CommentDBType = {
  _id: ObjectId
  content: string
  commentatorInfo: CommentatorInfoType
  createdAt: Date
  postId: ObjectId
}

export type CommentDBInsertType = Omit<CommentDBType, '_id'>

export type CommentType = {
  id: string
  content: string
  commentatorInfo: CommentatorInfoType
  createdAt: string
}

export type CommentatorInfoType = {
  userId: string
  userLogin: string
}

export type LoginSuccessType = {
  accessToken: string // JWT access token
}

export type DecodedToken = {
  userId: string
  email?: string
  iat: number
  exp: number
}

export type MeType = {
  email: string
  login: string
  userId: string
}
