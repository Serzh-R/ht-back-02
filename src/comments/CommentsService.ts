import { commentsRepository } from './CommentsRepository'
import { postsQueryRepository } from '../posts/PostsQueryRepository'
import { CommentDBType, CommentType } from './types'
import { Result } from '../common/result/result.type'
import { ResultStatus } from '../common/result/resultCode'

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

    const newComment: Omit<CommentDBType, '_id'> = {
      content: postData.content,
      commentatorInfo: {
        userId: postData.userId,
        userLogin: 'UserLogin',
      },
      createdAt: new Date(),
    }

    const commentId = await commentsRepository.createComment({
      content: newComment.content,
      commentatorInfo: newComment.commentatorInfo,
      createdAt: newComment.createdAt,
      postId: postData.postId,
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

/*async getCommentById(id: string): Promise<CommentType | null> {
    const comment = await commentsQueryRepository.getCommentById(id)
    if (!comment) return null

    return this._mapToViewModel(comment)
  },*/

/*_mapToViewModel(comment: CommentDBType): CommentType {
    return {
      id: comment._id.toString(),
      content: comment.content,
      commentatorInfo: {
        userId: comment.commentatorInfo.userId,
        userLogin: comment.commentatorInfo.userLogin,
      },
      createdAt: comment.createdAt.toISOString(),
    }
  },*/
