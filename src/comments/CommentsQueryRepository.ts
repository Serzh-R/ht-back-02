import { commentsCollection } from '../db/mongoDb'
import { ObjectId } from 'mongodb'
import { CommentDBType, CommentType } from '../coment/types'

export const commentsQueryRepository = {
  async getCommentById(id: string): Promise<CommentType | null> {
    const comment = await commentsCollection.findOne<CommentDBType>({ _id: new ObjectId(id) })
    if (!comment) {
      return null
    }

    return this._mapToCommentType(comment)
  },

  _mapToCommentType(comment: CommentDBType): CommentType {
    return {
      id: comment._id.toString(),
      content: comment.content,
      commentatorInfo: {
        userId: comment.commentatorInfo.userId,
        userLogin: comment.commentatorInfo.userLogin,
      },
      createdAt: comment.createdAt.toISOString(),
    }
  },
}
