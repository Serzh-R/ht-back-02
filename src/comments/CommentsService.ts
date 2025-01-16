import { commentsRepository } from './CommentsRepository'
import { CommentDBType, CommentType } from './types'

export const commentsService = {
  /*async getCommentById(id: string): Promise<CommentType | null> {
    const comment = await commentsQueryRepository.getCommentById(id)
    if (!comment) return null

    return this._mapToViewModel(comment)
  },*/

  async updateCommentById(id: string, content: string): Promise<boolean> {
    return await commentsRepository.updateCommentById(id, content)
  },

  async deleteComment(id: string): Promise<boolean> {
    return await commentsRepository.deleteById(id)
  },

  _mapToViewModel(comment: CommentDBType): CommentType {
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
