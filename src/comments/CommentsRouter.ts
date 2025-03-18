import { Router, Request, Response } from 'express'
import { HTTP_STATUSES } from '../settings'
import { commentsQueryRepository } from './CommentsQueryRepository'
import { errorsResultMiddleware } from '../validation/express-validator/errors.result.middleware'
import {
  commentContentValidator,
  idParamValidator,
} from '../validation/express-validator/field.validators'
import { commentsService } from './CommentsService'
import { jwtAccessAuthMiddleware } from '../auth/middlewares/jwt.access.auth.middleware'
import { ResultStatus } from '../common/result/resultCode'
import { checkCommentOwnership } from '../auth/middlewares/checkCommentOwnership'
import { LikeStatus } from './comment-types'

export const commentsRouter = Router()

class CommentsController {
  async getCommentById(req: Request, res: Response) {
    const id = req.params.id

    const commentById = await commentsQueryRepository.getCommentById(id)
    if (!commentById) {
      res.status(HTTP_STATUSES.NOT_FOUND_404).json('Comment not found')
      return
    }

    res.status(HTTP_STATUSES.OK_200).json(commentById)
  }

  async updateCommentLikeStatus(req: Request, res: Response) {
    const { id } = req.params
    const { likeStatus } = req.body
    const userId = req.userId

    if (!userId) {
      res.status(HTTP_STATUSES.UNAUTHORIZED_401).send({
        message: 'Unauthorized',
        field: 'userId',
      })
      return
    }

    if (!Object.values(LikeStatus).includes(likeStatus as LikeStatus)) {
      res.status(HTTP_STATUSES.BAD_REQUEST_400).send({
        message: 'Invalid likeStatus value',
        field: 'likeStatus',
      })
      return
    }

    const result = await commentsService.updateCommentLikeStatus(
      id,
      likeStatus as LikeStatus,
      userId,
    )

    if (result.status === ResultStatus.NotFound) {
      res.status(HTTP_STATUSES.NOT_FOUND_404).send(result.extensions)
      return
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  }

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
  }

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
  }
}

export const commentsController = new CommentsController()

commentsRouter.get('/:id', idParamValidator, commentsController.getCommentById)

commentsRouter.put(
  '/{commentId}/like-status',
  jwtAccessAuthMiddleware,
  checkCommentOwnership,
  idParamValidator,
  commentContentValidator,
  errorsResultMiddleware,
  commentsController.updateCommentLikeStatus,
)

commentsRouter.put(
  '/:id',
  jwtAccessAuthMiddleware,
  checkCommentOwnership,
  idParamValidator,
  commentContentValidator,
  errorsResultMiddleware,
  commentsController.updateCommentById,
)

commentsRouter.delete(
  '/:id',
  jwtAccessAuthMiddleware,
  checkCommentOwnership,
  idParamValidator,
  commentsController.deleteCommentById,
)
