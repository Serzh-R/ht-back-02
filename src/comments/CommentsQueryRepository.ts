import { CommentDB, Comment, PaginatorCommentType, LikeStatus } from './comment-types'
import { ResultStatus } from '../common/result/resultCode'
import { Result } from '../common/result/result.type'
import { PostModel } from '../posts/post-schema'
import { CommentModel } from './comment-schema'

class CommentsQueryRepository {
  async getCommentById(id: string): Promise<Comment | null> {
    const comment = await CommentModel.findById(id).lean()
    return comment ? this._mapViewModel(comment) : null
  }

  async getCommentsForPost(
    postId: string,
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
  ): Promise<Result<PaginatorCommentType>> {
    const postExists = await PostModel.exists({ _id: postId })
    if (!postExists) {
      return {
        status: ResultStatus.NotFound,
        errorMessage: 'Post not found',
        extensions: [{ field: 'postId', message: 'Invalid postId' }],
        data: null,
      }
    }

    const filter = { postId }

    const commentsCount = await CommentModel.countDocuments(filter)

    const comments = await CommentModel.find(filter)
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .select('-__v')
      .lean()

    return {
      status: ResultStatus.Success,
      data: {
        pagesCount: Math.ceil(commentsCount / pageSize),
        page: pageNumber,
        pageSize,
        totalCount: commentsCount,
        items: comments.map(this._mapViewModel),
      },
      extensions: [],
    }
  }

  _mapViewModel(comment: CommentDB): Comment {
    return {
      id: comment._id.toString(),
      content: comment.content,
      commentatorInfo: comment.commentatorInfo,
      createdAt: comment.createdAt.toISOString(),
      likesInfo: comment.likesInfo || {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: LikeStatus.None,
      },
    }
  }
}

export const commentsQueryRepository = new CommentsQueryRepository()

// *************************************************************************** //

/*
import { commentsCollection, postsCollection } from '../db/mongoDb'
import { ObjectId } from 'mongodb'
import { CommentDB, Comment, PaginatorCommentType } from './comment-types'
import { ResultStatus } from '../common/result/resultCode'
import { Result } from '../common/result/result.type'

class CommentsQueryRepository {
  async getCommentById(id: string): Promise<Comment | null> {
    const comment = await commentsCollection.findOne<CommentDB>({ _id: new ObjectId(id) })
    if (!comment) {
      return null
    }

    return this._mapViewModel(comment)
  }

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
        items: comments.map((comment: CommentDB) => this._mapViewModel(comment)),
      },
      extensions: [],
    }
  }

  _mapViewModel(comment: CommentDB): Comment {
    return {
      id: comment._id.toString(),
      content: comment.content,
      commentatorInfo: comment.commentatorInfo,
      createdAt: comment.createdAt.toISOString(),
    }
  }
}

export const commentsQueryRepository = new CommentsQueryRepository()
*/
