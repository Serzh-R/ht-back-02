export type DBType = {
  blogs: BlogViewModelType[]
  posts: PostViewModelType[]
}

export type FieldErrorType = {
  message: string
  field: string
}

export type APIErrorResultType = {
  errorsMessages: FieldErrorType[]
}

export type BlogViewModelType = {
  id: string
  name: string
  description: string
  websiteUrl: string
  createdAt: string
  isMembership: boolean
}

export type BlogInputModelType = {
  name: string
  description: string
  websiteUrl: string
}

export type PostViewModelType = {
  id: string
  title: string
  shortDescription: string
  content: string
  blogId: string
  blogName: string
  createdAt: string
}

export type PostInputModelType = {
  title: string
  shortDescription: string
  content: string
  blogId: string
}
