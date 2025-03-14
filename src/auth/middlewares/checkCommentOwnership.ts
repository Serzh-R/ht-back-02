import { Request, Response, NextFunction } from 'express'
import { commentsQueryRepository } from '../../comments/CommentsQueryRepository'
import { HTTP_STATUSES } from '../../settings'

export const checkCommentOwnership = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const userId = req.userId
  const commentId = req.params.id

  const comment = await commentsQueryRepository.getCommentById(commentId).catch((error) => {
    console.error('Error fetching comment:', error)
    return null
  })

  if (!comment) {
    res.status(HTTP_STATUSES.NOT_FOUND_404).json({
      errorsMessages: [{ field: 'Comment', message: 'Comment not found' }],
    })
    return
  }

  if (!userId) {
    res.status(HTTP_STATUSES.UNAUTHORIZED_401).json({
      errorsMessages: [{ message: 'Unauthorized', field: 'authorization' }],
    })
    return
  }

  if (!comment || comment.commentatorInfo.userId !== userId) {
    res.status(HTTP_STATUSES.FORBIDDEN_403).json({
      errorsMessages: [{ message: 'Access denied', field: 'commentId' }],
    })
    return
  }

  next()
}
