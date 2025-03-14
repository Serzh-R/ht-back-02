import { Schema, model, Model, HydratedDocument } from 'mongoose'
import { CommentatorInfo, CommentDB } from './comment-types'

type CommentModel = Model<CommentDB>
export type CommentDocument = HydratedDocument<CommentDB>

const CommentatorInfoSchema = new Schema<CommentatorInfo>({
  userId: { type: String, required: true },
  userLogin: { type: String, required: true },
})

const commentSchema = new Schema<CommentDB>({
  _id: { type: Schema.Types.ObjectId, auto: true },
  content: { type: String, required: true },
  commentatorInfo: { type: CommentatorInfoSchema, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  postId: { type: Schema.Types.ObjectId, required: true, ref: 'posts' },
})

export const CommentModel = model<CommentDB, CommentModel>('comments', commentSchema)
