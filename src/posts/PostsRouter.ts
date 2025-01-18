import { Router, Request, Response } from 'express'
import { HTTP_STATUSES } from '../settings'
import { PostInputType } from '../types/types'
import {
  blogIdValidator,
  commentContentValidator,
  idParamValidator,
  postContentValidator,
  postShortDescriptionValidator,
  postTitleValidator,
} from '../validation/express-validator/field.validators'
import { errorsResultMiddleware } from '../validation/express-validator/errors.result.middleware'
import { authMiddleware } from '../middlewares/auth.middleware'
import { paginationQueries } from '../helpers/paginations.values'
import { postsService } from './PostsService'
import { postsQueryRepository } from './PostsQueryRepository'
import { jwtAuthMiddleware } from '../middlewares/jwt.auth.middleware'
import { commentsService } from '../comments/CommentsService'
import { ResultStatus } from '../common/result/resultCode'
import { Result } from '../common/result/result.type'
import { ObjectId } from 'mongodb'
import { commentsQueryRepository } from '../comments/CommentsQueryRepository'
import { PaginatorCommentType } from '../comments/types'

export const postRouter = Router()

export const postController = {
  async getPosts(req: Request, res: Response) {
    const { pageNumber, pageSize, sortBy, sortDirection } = paginationQueries(req)

    const posts = await postsQueryRepository.getPosts(pageNumber, pageSize, sortBy, sortDirection)
    res.status(HTTP_STATUSES.OK_200).json(posts)
  },

  async createPost(req: Request, res: Response) {
    const body: PostInputType = req.body

    const newPost = await postsService.createPost(body)

    if (!newPost) {
      res.status(HTTP_STATUSES.BAD_REQUEST_400).json({
        errorsMessages: [{ message: 'Blog not found', field: 'blogId' }],
      })
      return
    }

    res.status(HTTP_STATUSES.CREATED_201).json(newPost)
  },

  async getPostById(req: Request, res: Response) {
    const id = req.params.id

    const postById = await postsQueryRepository.getPostById(id)
    if (!postById) {
      res.status(HTTP_STATUSES.NOT_FOUND_404).json('Post not found')
      return
    }

    res.status(HTTP_STATUSES.OK_200).json(postById)
  },

  async updatePost(req: Request, res: Response) {
    const id = req.params.id
    const body = req.body
    const isUpdated = await postsService.updatePost(id, body)
    if (!isUpdated) {
      res.status(HTTP_STATUSES.NOT_FOUND_404).json('Post not found')
    } else {
      res.status(HTTP_STATUSES.NO_CONTENT_204).send()
    }
  },

  async deletePost(req: Request, res: Response) {
    const id = req.params.id

    const isDeleted = await postsService.deletePost(id)
    if (!isDeleted) {
      res.status(HTTP_STATUSES.NOT_FOUND_404).json('Post not found')
    } else {
      res.status(HTTP_STATUSES.NO_CONTENT_204).send()
    }
  },

  async createCommentForPost(req: Request, res: Response) {
    const postId = req.params.postId
    const content = req.body.content
    const userId = req.userId

    if (!userId) {
      res
        .status(HTTP_STATUSES.UNAUTHORIZED_401)
        .send({ errorsMessages: [{ field: 'authorization', message: 'Unauthorized' }] })
      return
    }

    const result = await commentsService.createCommentForPost({
      postId,
      content,
      userId,
    })

    if (result.status !== ResultStatus.Success) {
      res.status(result.status === ResultStatus.NotFound ? 404 : 400).send({
        errorsMessages: result.extensions,
      })
      return
    }

    res.status(HTTP_STATUSES.CREATED_201).send(result.data)
  },

  async getCommentsForPost(req: Request, res: Response) {
    const postId = req.params.postId

    const post = await postsQueryRepository.getPostById(postId)

    if (!post) {
      res.status(HTTP_STATUSES.NOT_FOUND_404).json({ message: 'Post not found', field: 'postId' })
      return
    }

    const { pageNumber, pageSize, sortBy, sortDirection } = paginationQueries(req)

    const comments: PaginatorCommentType = await commentsQueryRepository.getCommentsForPost(
      postId,
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
    )

    res.status(HTTP_STATUSES.OK_200).json(comments)
  },
}

postRouter.get('/', postController.getPosts)
postRouter.post(
  '/',
  authMiddleware,
  postTitleValidator,
  postShortDescriptionValidator,
  postContentValidator,
  blogIdValidator,
  errorsResultMiddleware,
  postController.createPost,
)

postRouter.post(
  '/:id/comments',
  jwtAuthMiddleware,
  commentContentValidator,
  errorsResultMiddleware,
  postController.createCommentForPost,
)

postRouter.get(
  '/:id/comments',
  idParamValidator,
  errorsResultMiddleware,
  postController.getCommentsForPost,
)

postRouter.get('/:id', idParamValidator, errorsResultMiddleware, postController.getPostById)
postRouter.put(
  '/:id',
  authMiddleware,
  idParamValidator,
  postTitleValidator,
  postShortDescriptionValidator,
  postContentValidator,
  blogIdValidator,
  errorsResultMiddleware,
  postController.updatePost,
)
postRouter.delete(
  '/:id',
  authMiddleware,
  idParamValidator,
  errorsResultMiddleware,
  postController.deletePost,
)
