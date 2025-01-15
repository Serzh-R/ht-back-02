import { ObjectId } from 'mongodb'

export type DBType = {
  blogs: BlogType[]
  posts: PostType[]
}

export type FieldErrorType = {
  message: string
  field: string
}

export type APIErrorResultType = {
  errorsMessages: FieldErrorType[]
}

//********* Blog ***********************//

export type BlogDBType = {
  _id?: ObjectId
  name: string
  description: string
  websiteUrl: string
  createdAt: string
  isMembership: boolean
}

export type BlogType = {
  id: string
  name: string
  description: string
  websiteUrl: string
  createdAt: string
  isMembership: boolean
}

export type BlogDBInsertType = Omit<BlogType, 'id'>

export type PaginatorBlogType = {
  pagesCount: number
  page: number
  pageSize: number
  totalCount: number
  items: BlogType[]
}

export type BlogInputType = {
  name: string
  description: string
  websiteUrl: string
}

//******* Post **********************//

export type PostDBType = {
  _id: ObjectId
  title: string
  shortDescription: string
  content: string
  blogId: string
  blogName: string
  createdAt: string
}

export type PostDBInsertType = Omit<PostDBType, '_id'>

export type PostType = {
  id: string
  title: string
  shortDescription: string
  content: string
  blogId: string
  blogName: string
  createdAt: string
}

export type PaginatorPostType = {
  pagesCount: number
  page: number
  pageSize: number
  totalCount: number
  items: PostType[]
}

export type BlogPostInputType = {
  title: string // maxLength: 30
  shortDescription: string // maxLength: 100
  content: string // maxLength: 1000
}

export type PostInputType = {
  title: string
  shortDescription: string
  content: string
  blogId: string
}

//****** User ******************//

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
  passwordSalt: string
  createdAt: Date
}

export type UserDBInsertType = Omit<UserDBType, '_id'>

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
