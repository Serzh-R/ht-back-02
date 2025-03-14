import { ObjectId } from 'mongodb'
import { CommentDB } from './comment-types'
import { CommentModel } from './comment-schema'

class CommentsRepository {
  async updateCommentById(id: string, content: string): Promise<boolean> {
    const result = await CommentModel.updateOne({ _id: id }, { $set: { content } })
    return result.matchedCount > 0
  }

  async createComment(commentData: Omit<CommentDB, '_id'>): Promise<ObjectId> {
    const newComment = await CommentModel.create(commentData)
    return newComment._id
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await CommentModel.deleteOne({ _id: id })
    return result.deletedCount > 0
  }
}

export const commentsRepository = new CommentsRepository()

// ********************************************************************** //

/*
import { commentsCollection } from '../db/mongoDb'
import { ObjectId } from 'mongodb'
import { CommentDB } from './comment-types'

class CommentsRepository {
  async updateCommentById(id: string, content: string): Promise<boolean> {
    const result = await commentsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { content } },
    )
    return result.matchedCount > 0
  }

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
    } as CommentDB)

    return result.insertedId
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await commentsCollection.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  }
}

export const commentsRepository = new CommentsRepository()
*/
