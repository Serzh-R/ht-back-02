import { Router, Request, Response } from 'express'
import { HTTP_STATUSES } from '../settings'
import { PostInputType } from '../types/types'
import {
  blogIdValidator,
  idParamValidator,
  postContentValidator,
  postShortDescriptionValidator,
  postTitleValidator,
} from '../validation/express-validator/field-validators'
import { errorsResultMiddleware } from '../validation/express-validator/errors-result-middleware'
import { authMiddleware } from '../middlewares/auth-middleware'
import { paginationQueries } from '../helpers/paginations_values'
import { postsService } from './PostsService'
import { postsQueryRepository } from './PostsQueryRepository'

export const postRouter = Router()

export const postController = {
  async getPosts(req: Request, res: Response) {
    const { pageNumber, pageSize, sortBy, sortDirection } =
      paginationQueries(req)

    const posts = await postsQueryRepository.getPosts(
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
    )
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
postRouter.get(
  '/:id',
  idParamValidator,
  errorsResultMiddleware,
  postController.getPostById,
)
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