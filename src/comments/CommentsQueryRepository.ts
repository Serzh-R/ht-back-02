import { commentsCollection } from '../db/mongoDb'
import { ObjectId } from 'mongodb'
import { CommentDBType, CommentType, PaginatorCommentType } from './types'

export const commentsQueryRepository = {
  async getCommentById(id: string): Promise<CommentType | null> {
    const comment = await commentsCollection.findOne<CommentDBType>({ _id: new ObjectId(id) })
    if (!comment) {
      return null
    }

    return this._mapViewModel(comment)
  },

  async getCommentsForPost({
    postId,
    pageNumber,
    pageSize,
    sortBy,
    sortDirection,
  }: {
    postId: string
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: 'asc' | 'desc'
  }): Promise<PaginatorCommentType> {
    if (!ObjectId.isValid(postId)) {
      throw new Error('Invalid postId')
    }

    const filter = { postId: new ObjectId(postId) }

    const commentsCount = await commentsCollection.countDocuments(filter)

    const comments: CommentDBType[] = await commentsCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray()

    return {
      pagesCount: Math.ceil(commentsCount / pageSize),
      page: pageNumber,
      pageSize,
      totalCount: commentsCount,
      items: comments.map((comment: CommentDBType) => this._mapViewModel(comment)),
    }
  },

  _mapViewModel(comment: CommentDBType): CommentType {
    return {
      id: comment._id.toString(),
      content: comment.content,
      commentatorInfo: comment.commentatorInfo,
      createdAt: comment.createdAt.toISOString(),
    }
  },
}
