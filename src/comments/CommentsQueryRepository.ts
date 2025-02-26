import { commentsCollection, postsCollection } from '../db/mongoDb'
import { ObjectId } from 'mongodb'
import { CommentDBType, CommentType, PaginatorCommentType } from './comment-types'
import { ResultStatus } from '../common/result/resultCode'
import { Result } from '../common/result/result.type'

export const commentsQueryRepository = {
  async getCommentById(id: string): Promise<CommentType | null> {
    const comment = await commentsCollection.findOne<CommentDBType>({ _id: new ObjectId(id) })
    if (!comment) {
      return null
    }

    return this._mapViewModel(comment)
  },

  async getCommentsForPost(
    postId: string,
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
  ): Promise<Result<PaginatorCommentType>> {
    if (!ObjectId.isValid(postId)) {
      throw new Error('Invalid postId')
    }

    const post = await postsCollection.findOne({ _id: new ObjectId(postId) })

    if (!post) {
      return {
        status: ResultStatus.NotFound,
        errorMessage: 'Post not found',
        extensions: [{ field: 'postId', message: 'Invalid postId' }],
        data: null,
      }
    }

    const filter = { postId: new ObjectId(postId) }

    const commentsCount = await commentsCollection.countDocuments(filter)

    const comments = await commentsCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray()

    return {
      status: ResultStatus.Success,
      data: {
        pagesCount: Math.ceil(commentsCount / pageSize),
        page: pageNumber,
        pageSize,
        totalCount: commentsCount,
        items: comments.map((comment: CommentDBType) => this._mapViewModel(comment)),
      },
      extensions: [],
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
