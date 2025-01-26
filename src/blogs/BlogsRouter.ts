import { Router, Request, Response } from 'express'
import { HTTP_STATUSES } from '../settings'
import { BlogInputType, BlogPostInputType, PaginatorPostType } from '../types/types'
import {
  blogFieldsValidator,
  idParamValidator,
  postContentValidator,
  postShortDescriptionValidator,
  postTitleValidator,
} from '../validation/express-validator/field.validators'
import { errorsResultMiddleware } from '../validation/express-validator/errors.result.middleware'
import { blogsService } from './BlogsService'
import { paginationQueries } from '../common/helpers/paginations.values'
import { postsService } from '../posts/PostsService'
import { blogsQueryRepository } from './BlogsQueryRepository'
import { postsQueryRepository } from '../posts/PostsQueryRepository'
import { authMiddleware } from '../middlewares/auth.middleware'

export const blogRouter = Router()

export const blogController = {
  async getBlogs(req: Request, res: Response) {
    const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize } = paginationQueries(req)

    const blogs = await blogsQueryRepository.getBlogs(
      searchNameTerm,
      sortBy,
      sortDirection,
      pageNumber,
      pageSize,
    )
    res.status(HTTP_STATUSES.OK_200).json(blogs)
  },

  async createBlog(req: Request, res: Response) {
    const body: BlogInputType = req.body

    const newBlog = await blogsService.createBlog(body)

    res.status(HTTP_STATUSES.CREATED_201).json(newBlog)
  },

  async createPostForBlog(req: Request, res: Response): Promise<void> {
    const id = req.params.id
    const body: BlogPostInputType = req.body

    const createdPost = await postsService.createPostForBlog(id, body)

    if (!createdPost) {
      res.status(HTTP_STATUSES.NOT_FOUND_404).json({ message: 'Blog not found', field: 'id' })
      return
    }

    res.status(HTTP_STATUSES.CREATED_201).json(createdPost)
  },

  async getBlogById(req: Request, res: Response) {
    const blogId = req.params.id

    const blog = await blogsQueryRepository.getBlogById(blogId)
    if (!blog) {
      res.status(HTTP_STATUSES.NOT_FOUND_404).json({ message: 'Blog not found' })
      return
    }
    res.status(HTTP_STATUSES.OK_200).json(blog)
  },

  async getPostsForBlog(req: Request, res: Response): Promise<void> {
    const blogId = req.params.id

    const blog = await blogsQueryRepository.getBlogById(blogId)
    if (!blog) {
      res.status(HTTP_STATUSES.NOT_FOUND_404).json({ message: 'Blog not found', field: 'blogId' })
      return
    }

    const { pageNumber, pageSize, sortBy, sortDirection } = paginationQueries(req)

    const posts: PaginatorPostType = await postsQueryRepository.getPostsForBlog(
      blogId,
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
    )

    res.status(HTTP_STATUSES.OK_200).json(posts)
  },

  async updateBlog(req: Request, res: Response) {
    const id = req.params.id
    const body: BlogInputType = req.body
    const isUpdated = await blogsService.updateBlog(id, body)
    if (!isUpdated) {
      res.status(HTTP_STATUSES.NOT_FOUND_404).json({ message: 'Blog not found' })
      return
    }
    res.status(HTTP_STATUSES.NO_CONTENT_204).send()
  },

  async deleteBlog(req: Request, res: Response) {
    const id = req.params.id

    const isDeleted = await blogsService.deleteBlog(id)
    if (!isDeleted) {
      res.status(HTTP_STATUSES.NOT_FOUND_404).json({ message: 'Blog not found' })
      return
    }
    res.status(HTTP_STATUSES.NO_CONTENT_204).send()
  },
}

blogRouter.get('/', blogController.getBlogs)

blogRouter.get(
  '/:id/posts',
  idParamValidator,
  errorsResultMiddleware,
  blogController.getPostsForBlog,
)

blogRouter.post(
  '/',
  authMiddleware,
  blogFieldsValidator,
  errorsResultMiddleware,
  blogController.createBlog,
)

blogRouter.post(
  '/:id/posts',
  authMiddleware,
  idParamValidator,
  postTitleValidator,
  postShortDescriptionValidator,
  postContentValidator,
  errorsResultMiddleware,
  blogController.createPostForBlog,
)

blogRouter.get('/:id', idParamValidator, errorsResultMiddleware, blogController.getBlogById)

blogRouter.put(
  '/:id',
  authMiddleware,
  idParamValidator,
  blogFieldsValidator,
  errorsResultMiddleware,
  blogController.updateBlog,
)

blogRouter.delete(
  '/:id',
  authMiddleware,
  idParamValidator,
  errorsResultMiddleware,
  blogController.deleteBlog,
)
