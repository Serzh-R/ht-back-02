import { HydratedDocument, model, Model, Schema } from 'mongoose'
import { BlogDB } from './blog-post-types'

type BlogModel = Model<BlogDB>

export type BlogDocument = HydratedDocument<BlogDB>

const blogSchema = new Schema<BlogDB>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  websiteUrl: { type: String, required: true },
  createdAt: { type: Date },
  isMembership: { type: Boolean, default: true },
})

export const BlogModel = model<BlogDB, BlogModel>('blogs', blogSchema)
