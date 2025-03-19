import { Schema, model, Model, HydratedDocument } from 'mongoose'
import { CommentatorInfo, CommentDB, Like, LikesInfo, LikeStatus } from './comment-types'

type CommentModelType = Model<CommentDB>
export type CommentDocument = HydratedDocument<CommentDB>

const CommentatorInfoSchema = new Schema<CommentatorInfo>(
  {
    userId: { type: String, required: true },
    userLogin: { type: String, required: true },
  },
  { _id: false, id: false },
)

const LikeSchema = new Schema<Like>(
  {
    userId: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
    myStatus: {
      type: String,
      enum: Object.values(LikeStatus),
      required: true,
      default: LikeStatus.None,
    },
  },
  { _id: false, id: false },
)

const LikesInfoSchema = new Schema<LikesInfo>(
  {
    likesCount: { type: Number, required: true, default: 0 },
    dislikesCount: { type: Number, required: true, default: 0 },
    likes: { type: [LikeSchema], default: [] },
  },
  { _id: false, id: false },
)

const commentSchema = new Schema<CommentDB>({
  _id: { type: Schema.Types.ObjectId, auto: true },
  content: { type: String, required: true, minlength: 20, maxlength: 300 },
  commentatorInfo: { type: CommentatorInfoSchema, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  postId: { type: Schema.Types.ObjectId, required: true, ref: 'posts' },
  likesInfo: {
    type: LikesInfoSchema,
    required: true,
    default: { likesCount: 0, dislikesCount: 0, likes: [] }, // ✅ Теперь likesInfo всегда есть
  },
})

export const CommentModel = model<CommentDB, CommentModelType>('comments', commentSchema)
