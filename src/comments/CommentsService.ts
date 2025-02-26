import { commentsRepository } from './CommentsRepository'
import { postsQueryRepository } from '../posts/PostsQueryRepository'
import { CommentDBInsertType, CommentType } from './comment-types'
import { Result } from '../common/result/result.type'
import { ResultStatus } from '../common/result/resultCode'
import { ObjectId } from 'mongodb'
import { commentsQueryRepository } from './CommentsQueryRepository'
import { usersQueryRepository } from '../users/UsersQueryRepository'

export const commentsService = {
  async updateCommentById(
    commentId: string,
    userId: string | null | undefined,
    content: string,
  ): Promise<Result<boolean>> {
    const comment = await commentsQueryRepository.getCommentById(commentId)

    if (!comment) {
      return {
        status: ResultStatus.NotFound,
        errorMessage: 'Comment not found',
        extensions: [{ field: 'commentId', message: 'Invalid commentId' }],
        data: false,
      }
    }

    if (comment.commentatorInfo.userId !== userId) {
      return {
        status: ResultStatus.Forbidden,
        errorMessage: 'Access denied',
        extensions: [{ field: 'userId', message: 'You are not the owner of this comment' }],
        data: false,
      }
    }

    const success = await commentsRepository.updateCommentById(commentId, content)

    return {
      status: ResultStatus.Success,
      data: success,
      extensions: [],
    }
  },

  async deleteComment(
    commentId: string,
    userId: string | null | undefined,
  ): Promise<Result<boolean>> {
    const comment = await commentsQueryRepository.getCommentById(commentId)

    if (!comment) {
      return {
        status: ResultStatus.NotFound,
        errorMessage: 'Comment not found',
        extensions: [{ field: 'commentId', message: 'Invalid commentId' }],
        data: false,
      }
    }

    if (comment.commentatorInfo.userId !== userId) {
      return {
        status: ResultStatus.Forbidden,
        errorMessage: 'Access denied',
        extensions: [{ field: 'userId', message: 'You are not the owner of this comment' }],
        data: false,
      }
    }

    const success = await commentsRepository.deleteById(commentId)

    return {
      status: ResultStatus.Success,
      data: success,
      extensions: [],
    }
  },

  async createCommentForPost(postData: {
    postId: string
    content: string
    userId: string
  }): Promise<Result<CommentType>> {
    const post = await postsQueryRepository.getPostById(postData.postId)

    if (!post) {
      return {
        status: ResultStatus.NotFound,
        errorMessage: 'Post not found',
        extensions: [{ field: 'postId', message: 'Invalid postId' }],
        data: null,
      }
    }

    const user = await usersQueryRepository.getUserById(postData.userId)

    if (!user) {
      return {
        status: ResultStatus.NotFound,
        errorMessage: 'User not found',
        extensions: [{ field: 'userId', message: 'Invalid userId' }],
        data: null,
      }
    }

    const newComment: CommentDBInsertType = {
      content: postData.content,
      commentatorInfo: {
        userId: postData.userId,
        userLogin: user.login,
      },
      createdAt: new Date(),
      postId: new ObjectId(postData.postId),
    }

    const commentId = await commentsRepository.createComment({
      content: newComment.content,
      commentatorInfo: newComment.commentatorInfo,
      createdAt: newComment.createdAt,
      postId: newComment.postId,
    })

    return {
      status: ResultStatus.Success,
      data: {
        id: commentId.toString(),
        content: newComment.content,
        commentatorInfo: newComment.commentatorInfo,
        createdAt: newComment.createdAt.toISOString(),
      },
      extensions: [],
    }
  },
}
