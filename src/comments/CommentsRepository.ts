import { commentsCollection } from '../db/mongoDb'
import { ObjectId } from 'mongodb'
import { CommentDBType } from './comment-types'

export const commentsRepository = {
  async updateCommentById(id: string, content: string): Promise<boolean> {
    const result = await commentsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { content } },
    )
    return result.matchedCount > 0
  },

  async createComment(commentData: {
    content: string
    commentatorInfo: { userId: string; userLogin: string }
    createdAt: Date
    postId: ObjectId
  }): Promise<ObjectId> {
    const result = await commentsCollection.insertOne({
      content: commentData.content,
      commentatorInfo: commentData.commentatorInfo,
      createdAt: commentData.createdAt,
      postId: commentData.postId,
    } as CommentDBType)

    return result.insertedId
  },

  async deleteById(id: string): Promise<boolean> {
    const result = await commentsCollection.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  },
}
