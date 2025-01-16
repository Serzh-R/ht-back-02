import { Router, Request, Response } from 'express'
import { HTTP_STATUSES } from '../settings'
import { commentsQueryRepository } from './CommentsQueryRepository'
import { errorsResultMiddleware } from '../validation/express-validator/errors-result-middleware'
import { idParamValidator } from '../validation/express-validator/field-validators'

export const commentsRouter = Router()

export const commentsController = {
  async getCommentById(req: Request, res: Response) {
    const id = req.params.id

    const commentById = await commentsQueryRepository.getCommentById(id)
    if (!commentById) {
      res.status(HTTP_STATUSES.NOT_FOUND_404).json('Comment not found')
      return
    }

    res.status(HTTP_STATUSES.OK_200).json(commentById)
  },
}

commentsRouter.get(
  '/:id',
  idParamValidator,
  errorsResultMiddleware,
  commentsController.getCommentById,
)
