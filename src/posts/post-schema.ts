import { HydratedDocument, model, Model, Schema } from 'mongoose'
import { PostDB } from '../blogs/blog-post-types'

type PostModelType = Model<PostDB>

export type PostDocument = HydratedDocument<PostDB>

const postSchema = new Schema<PostDB>({
  title: { type: String, required: true },
  shortDescription: { type: String, required: true },
  content: { type: String, required: true },
  blogId: { type: String, required: true },
  blogName: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
})

export const PostModel = model<PostDB, PostModelType>('posts', postSchema)
