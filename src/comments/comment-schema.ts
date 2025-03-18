import { Schema, model, Model, HydratedDocument } from 'mongoose'
import { CommentatorInfo, CommentDB, LikesInfo, LikeStatus } from './comment-types'

type CommentModelType = Model<CommentDB>
export type CommentDocument = HydratedDocument<CommentDB>

const CommentatorInfoSchema = new Schema<CommentatorInfo>({
  userId: { type: String, required: true },
  userLogin: { type: String, required: true },
})

const LikesSchema = new Schema<LikesInfo>({
  userId: { type: String, required: true },
  likesCount: { type: Number, required: true, default: 0 },
  dislikesCount: { type: Number, required: true, default: 0 },
  myStatus: {
    type: String,
    enum: Object.values(LikeStatus),
    required: true,
    default: LikeStatus.None,
  },
})

const commentSchema = new Schema<CommentDB>({
  _id: { type: Schema.Types.ObjectId, auto: true },
  content: { type: String, required: true, minlength: 20, maxlength: 300 },
  commentatorInfo: { type: CommentatorInfoSchema, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  postId: { type: Schema.Types.ObjectId, required: true, ref: 'posts' },
  likesInfo: { type: [LikesSchema], required: true, default: [] },
})

export const CommentModel = model<CommentDB, CommentModelType>('comments', commentSchema)
