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
  createdAt: Date
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
