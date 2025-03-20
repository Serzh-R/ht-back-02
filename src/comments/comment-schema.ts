import { Schema, model, Model, HydratedDocument } from 'mongoose'
import { CommentatorInfo, CommentDB, Like, LikesInfo, LikeStatus } from './comment-types'

type LikeModelType = Model<Like>
export type LikeDocument = HydratedDocument<Like>

const likeSchema = new Schema<Like>({
  userId: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  myStatus: {
    type: String,
    enum: Object.values(LikeStatus),
    required: true,
    default: LikeStatus.None,
  },
})

export const LikeModel = model<Like, LikeModelType>('likes', likeSchema)

// ******************************************************************** //

type CommentModelType = Model<CommentDB>
export type CommentDocument = HydratedDocument<CommentDB>

const commentatorInfoSchema = new Schema<CommentatorInfo>(
  {
    userId: { type: String, required: true },
    userLogin: { type: String, required: true },
  },
  { _id: false, id: false },
)

const likesInfoSchema = new Schema<LikesInfo>(
  {
    likesCount: { type: Number, required: true, default: 0 },
    dislikesCount: { type: Number, required: true, default: 0 },
    myStatus: { type: String, required: true, default: 'None' },
  },
  { _id: false, id: false },
)

const commentSchema = new Schema<CommentDB>({
  _id: { type: Schema.Types.ObjectId, auto: true },
  content: { type: String, required: true, minlength: 20, maxlength: 300 },
  commentatorInfo: { type: commentatorInfoSchema, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  postId: { type: Schema.Types.ObjectId, required: true, ref: 'posts' },
  likesInfo: { type: likesInfoSchema, required: true },
})

export const CommentModel = model<CommentDB, CommentModelType>('comments', commentSchema)
