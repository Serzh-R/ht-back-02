import { Router, Request, Response } from 'express'
import { HTTP_STATUSES } from '../settings'
import { commentsQueryRepository } from './CommentsQueryRepository'
import { errorsResultMiddleware } from '../validation/express-validator/errors.result.middleware'
import { idParamValidator } from '../validation/express-validator/field.validators'
import { commentsService } from './CommentsService'
import { jwtAuthMiddleware } from '../middlewares/jwt.auth.middleware'

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
    const id = req.params.id
    const { content } = req.body

    if (!content || content.length < 20 || content.length > 300) {
      res.status(HTTP_STATUSES.BAD_REQUEST_400).send({
        errorsMessages: [
          { field: 'content', message: 'Content must be between 20 and 300 characters' },
        ],
      })
      return
    }

    const isUpdated = await commentsService.updateCommentById(id, content)
    if (!isUpdated) {
      res
        .status(HTTP_STATUSES.NOT_FOUND_404)
        .send({ errorsMessages: [{ field: 'id', message: 'Comment not found' }] })
      return
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  },

  async deleteCommentById(req: Request, res: Response) {
    const id = req.params.id

    const isDeleted = await commentsService.deleteComment(id)
    if (!isDeleted) {
      res
        .status(HTTP_STATUSES.NOT_FOUND_404)
        .send({ errorsMessages: [{ field: 'id', message: 'Comment not found' }] })
      return
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  },
}

commentsRouter.get('/:id', idParamValidator, commentsController.getCommentById)

commentsRouter.put(
  '/:id',
  jwtAuthMiddleware,
  idParamValidator,
  errorsResultMiddleware,
  commentsController.updateCommentById,
)

commentsRouter.delete(
  '/:id',
  jwtAuthMiddleware,
  idParamValidator,
  commentsController.deleteCommentById,
)
