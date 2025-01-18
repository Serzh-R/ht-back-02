import { commentsRepository } from './CommentsRepository'
import { postsQueryRepository } from '../posts/PostsQueryRepository'
import { CommentDBInsertType, CommentType } from './types'
import { Result } from '../common/result/result.type'
import { ResultStatus } from '../common/result/resultCode'
import { ObjectId } from 'mongodb'

export const commentsService = {
  async updateCommentById(id: string, content: string): Promise<boolean> {
    return await commentsRepository.updateCommentById(id, content)
  },

  async deleteComment(id: string): Promise<boolean> {
    return await commentsRepository.deleteById(id)
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

    const newComment: CommentDBInsertType = {
      content: postData.content,
      commentatorInfo: {
        userId: postData.userId,
        userLogin: 'UserLogin',
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
