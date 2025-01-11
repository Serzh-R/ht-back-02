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

export type PostDBType = {
  _id: ObjectId
  title: string
  shortDescription: string
  content: string
  blogId: string
  blogName: string
  createdAt: string
}

export type PostType = {
  id?: string
  title: string
  shortDescription: string
  content: string
  blogId: string
  blogName: string
  createdAt: string
}

export type PostDBInsertType = Omit<PostType, 'id'>

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

export type UserType = {
  id: string
  login: string
  email: string
  createdAt: string
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
