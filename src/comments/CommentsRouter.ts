import { Router, Request, Response } from 'express'
import { HTTP_STATUSES } from '../settings'
import { commentsQueryRepository } from './CommentsQueryRepository'
import { errorsResultMiddleware } from '../validation/express-validator/errors.result.middleware'
import {
  commentContentValidator,
  idParamValidator,
} from '../validation/express-validator/field.validators'
import { commentsService } from './CommentsService'
import { jwtAuthMiddleware } from '../middlewares/jwt.auth.middleware'
import { ResultStatus } from '../common/result/resultCode'
import { checkCommentOwnership } from '../middlewares/checkCommentOwnership'

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

  async updateCommentById(req: Request, res: Response) {
    const { id } = req.params
    const { content } = req.body
    const userId = req.userId

    const result = await commentsService.updateCommentById(id, userId, content)

    if (result.status === ResultStatus.NotFound) {
      res.status(HTTP_STATUSES.NOT_FOUND_404).send(result.extensions)
      return
    }

    if (result.status === ResultStatus.Forbidden) {
      res.status(HTTP_STATUSES.FORBIDDEN_403).send(result.extensions)
      return
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  },

  async deleteCommentById(req: Request, res: Response) {
    const { id } = req.params
    const userId = req.userId

    const result = await commentsService.deleteComment(id, userId)

    if (result.status === ResultStatus.NotFound) {
      res.status(HTTP_STATUSES.NOT_FOUND_404).send(result.extensions)
      return
    }

    if (result.status === ResultStatus.Forbidden) {
      res.status(HTTP_STATUSES.FORBIDDEN_403).send(result.extensions)
      return
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  },
}

commentsRouter.get('/:id', idParamValidator, commentsController.getCommentById)

commentsRouter.put(
  '/:id',
  jwtAuthMiddleware,
  checkCommentOwnership,
  idParamValidator,
  commentContentValidator,
  errorsResultMiddleware,
  commentsController.updateCommentById,
)

commentsRouter.delete(
  '/:id',
  jwtAuthMiddleware,
  checkCommentOwnership,
  idParamValidator,
  commentsController.deleteCommentById,
)
