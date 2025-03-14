// ********* DB Type ******************* //
import { ObjectId } from 'mongodb'

export class DBType {
  constructor(
    public blogs: Blog[],
    public posts: PostViewModel[],
  ) {}
}

// ********* Error Types **************** //
export class FieldErrorType {
  constructor(
    public message: string,
    public field: string,
  ) {}
}

export class APIErrorResultType {
  constructor(public errorsMessages: FieldErrorType[]) {}
}

//********* Blog ***********************//

export class BlogDB {
  constructor(
    //public _id: ObjectId | undefined, // Optional for MongoDB insertions
    public name: string,
    public description: string,
    public websiteUrl: string,
    public createdAt: Date,
    public isMembership: boolean,
  ) {}
}

export class Blog {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public websiteUrl: string,
    public createdAt: string,
    public isMembership: boolean,
  ) {}
}

export class BlogDBInsertType {
  constructor(
    public name: string,
    public description: string,
    public websiteUrl: string,
    public createdAt: string,
    public isMembership: boolean,
  ) {}
}

export class PaginatorBlogType {
  constructor(
    public pagesCount: number,
    public page: number,
    public pageSize: number,
    public totalCount: number,
    public items: Blog[],
  ) {}
}

export class BlogInputType {
  constructor(
    public name: string,
    public description: string,
    public websiteUrl: string,
  ) {}
}

//******* Post **********************//

export class PostDB {
  constructor(
    //public _id: ObjectId,
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
    public blogName: string,
    public createdAt: Date,
  ) {}
}

// export class PostDBInsertType {
//   constructor(
//     public title: string,
//     public shortDescription: string,
//     public content: string,
//     public blogId: string,
//     public blogName: string,
//     public createdAt: Date,
//   ) {}
// }

export class PostViewModel {
  constructor(
    public id: string,
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
    public blogName: string,
    public createdAt: string,
  ) {}
}

export class PaginatorPostViewModel {
  constructor(
    public pagesCount: number,
    public page: number,
    public pageSize: number,
    public totalCount: number,
    public items: PostViewModel[],
  ) {}
}

export class BlogPostInputModel {
  constructor(
    public title: string,
    public shortDescription: string,
    public content: string,
  ) {}
}

export class PostInputModel {
  constructor(
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
  ) {}
}

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

// export type DBType = {
//   blogs: BlogType[]
//   posts: PostType[]
// }
//
// export type FieldErrorType = {
//   message: string
//   field: string
// }
//
// export type APIErrorResultType = {
//   errorsMessages: FieldErrorType[]
// }

//***********************************************************************

// export type BlogDBType = {
//   _id?: ObjectId
//   name: string
//   description: string
//   websiteUrl: string
//   createdAt: string
//   isMembership: boolean
// }
//
// export type BlogType = {
//   id: string
//   name: string
//   description: string
//   websiteUrl: string
//   createdAt: string
//   isMembership: boolean
// }
//
// export type BlogDBInsertType = Omit<BlogType, 'id'>
//
// export type PaginatorBlogType = {
//   pagesCount: number
//   page: number
//   pageSize: number
//   totalCount: number
//   items: BlogType[]
// }
//
// export type BlogInputType = {
//   name: string
//   description: string
//   websiteUrl: string
// }

//********************************************************************

// export type PostDBType = {
//   _id: ObjectId
//   title: string
//   shortDescription: string
//   content: string
//   blogId: string
//   blogName: string
//   createdAt: Date
// }
//
// export type PostDBInsertType = Omit<PostDBType, '_id'>
//
// export type PostType = {
//   id: string
//   title: string
//   shortDescription: string
//   content: string
//   blogId: string
//   blogName: string
//   createdAt: string
// }
//
// export type PaginatorPostType = {
//   pagesCount: number
//   page: number
//   pageSize: number
//   totalCount: number
//   items: PostType[]
// }
//
// export type BlogPostInputType = {
//   title: string // maxLength: 30
//   shortDescription: string // maxLength: 100
//   content: string // maxLength: 1000
// }
//
// export type PostInputType = {
//   title: string
//   shortDescription: string
//   content: string
//   blogId: string
// }
