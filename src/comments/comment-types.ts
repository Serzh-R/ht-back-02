import { ObjectId } from 'mongodb'

// ********* Comment Types ******************* //

export class CommentInputType {
  constructor(public content: string) {}
}

export class CommentDB {
  constructor(
    public _id: ObjectId,
    public content: string,
    public commentatorInfo: CommentatorInfo,
    public createdAt: Date,
    public postId: ObjectId,
    public likesInfo: LikesInfo,
  ) {}
}

export class CommentDBInsertType {
  constructor(
    public content: string,
    public commentatorInfo: CommentatorInfo,
    public createdAt: Date,
    public postId: ObjectId,
    public likesInfo: LikesInfo,
  ) {}
}

export class Comment {
  constructor(
    public id: string,
    public content: string,
    public commentatorInfo: CommentatorInfo,
    public createdAt: string,
    public likesInfo: LikesInfo,
  ) {}
}

export class CommentatorInfo {
  constructor(
    public userId: string,
    public userLogin: string,
  ) {}
}

export class LikesInfo {
  constructor(
    public likesCount: number,
    public dislikesCount: number,
    public likes: Like[],
  ) {}
}

export class Like {
  constructor(
    public userId: string,
    public createdAt: Date,
    public myStatus: LikeStatus,
  ) {}
}

export enum LikeStatus {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike',
}

export class PaginatorCommentType {
  constructor(
    public pagesCount: number,
    public page: number,
    public pageSize: number,
    public totalCount: number,
    public items: Comment[],
  ) {}
}

// ********* Auth and User Types ******************* //

// Ответ на успешный логин с токеном доступа
export class LoginSuccessType {
  constructor(
    public accessToken: string, // JWT access token
  ) {}
}

// Декодированный токен JWT
export class DecodedToken {
  constructor(
    public userId: string,
    public email: string | undefined,
    public iat: number,
    public exp: number,
  ) {}
}

// Информация о текущем пользователе
export class MeType {
  constructor(
    public email: string,
    public login: string,
    public userId: string,
  ) {}
}

///////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

// export type CommentInputType = {
//   content: string // maxLength: 300   minLength: 20
// }
//
// export type CommentDBType = {
//   _id: ObjectId
//   content: string
//   commentatorInfo: CommentatorInfoType
//   createdAt: Date
//   postId: ObjectId
// }
//
// export type CommentDBInsertType = Omit<CommentDBType, '_id'>
//
// export type CommentType = {
//   id: string
//   content: string
//   commentatorInfo: CommentatorInfoType
//   createdAt: string
// }
//
// export type CommentatorInfoType = {
//   userId: string
//   userLogin: string
// }
//
// export type PaginatorCommentType = {
//   pagesCount: number
//   page: number
//   pageSize: number
//   totalCount: number
//   items: CommentType[]
// }
//
// export type LoginSuccessType = {
//   accessToken: string // JWT access token
// }
//
// export type DecodedToken = {
//   userId: string
//   email?: string
//   iat: number
//   exp: number
// }
//
// export type MeType = {
//   email: string
//   login: string
//   userId: string
// }
