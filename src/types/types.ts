export type DBType = {
  blogs: BlogType[]
  posts: PostType[]
}

export enum SortDirectionsEnam {
  ASC = "asc",
  DESC = "desc",
}

export type FieldErrorType = {
  message: string
  field: string
}

export type APIErrorResultType = {
  errorsMessages: FieldErrorType[]
}

export type BlogType = {
  id: string
  name: string
  description: string
  websiteUrl: string
  createdAt: string
  isMembership: boolean
}

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
