import { Router, Request, Response } from 'express'
import { HTTP_STATUSES } from '../settings'
import { BlogInputType, BlogPostInputModel, PaginatorPostViewModel } from './blog-post-types'
import {
  blogFieldsValidator,
  idParamValidator,
  postContentValidator,
  postShortDescriptionValidator,
  postTitleValidator,
} from '../validation/express-validator/field.validators'
import { errorsResultMiddleware } from '../validation/express-validator/errors.result.middleware'
import { BlogsService } from './BlogsService'
import { paginationQueries } from '../common/helpers/paginations.values'
import { postsService } from '../posts/PostsService'
import { BlogsQueryRepository } from './BlogsQueryRepository'
import { postsQueryRepository } from '../posts/PostsQueryRepository'
import { authMiddleware } from '../auth/middlewares/auth.middleware'
import { BlogsRepository } from './BlogsRepository'

export const blogRouter = Router()

class BlogController {
  private blogsService: BlogsService
  private blogsQueryRepository: BlogsQueryRepository
  constructor() {
    const repository = new BlogsRepository()

    this.blogsService = new BlogsService(repository)

    this.blogsQueryRepository = new BlogsQueryRepository()
  }
  async getBlogs(req: Request, res: Response) {
    const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize } = paginationQueries(req)

    const blogs = await this.blogsQueryRepository.getBlogs(
      searchNameTerm,
      sortBy,
      sortDirection,
      pageNumber,
      pageSize,
    )
    res.status(HTTP_STATUSES.OK_200).json(blogs)
  }

  async createBlog(req: Request, res: Response) {
    const body: BlogInputType = req.body

    const newBlog = await this.blogsService.createBlog(body)

    res.status(HTTP_STATUSES.CREATED_201).json(newBlog)
  }

  async createPostForBlog(req: Request, res: Response): Promise<void> {
    const id = req.params.id
    const body: BlogPostInputModel = req.body

    const createdPost = await postsService.createPostForBlog(id, body)

    if (!createdPost) {
      res.status(HTTP_STATUSES.NOT_FOUND_404).json({ message: 'Blog not found', field: 'id' })
      return
    }

    res.status(HTTP_STATUSES.CREATED_201).json(createdPost)
  }

  async getBlogById(req: Request, res: Response) {
    const blogId = req.params.id

    const blog = await this.blogsQueryRepository.getBlogById(blogId)
    if (!blog) {
      res.status(HTTP_STATUSES.NOT_FOUND_404).json({ message: 'Blog not found' })
      return
    }
    res.status(HTTP_STATUSES.OK_200).json(blog)
  }

  async getPostsForBlog(req: Request, res: Response): Promise<void> {
    const blogId = req.params.id

    const blog = await this.blogsQueryRepository.getBlogById(blogId)
    if (!blog) {
      res.status(HTTP_STATUSES.NOT_FOUND_404).json({ message: 'Blog not found', field: 'blogId' })
      return
    }

    const { pageNumber, pageSize, sortBy, sortDirection } = paginationQueries(req)

    const posts: PaginatorPostViewModel = await postsQueryRepository.getPostsForBlog(
      blogId,
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
    )

    res.status(HTTP_STATUSES.OK_200).json(posts)
  }

  async updateBlog(req: Request, res: Response) {
    const id = req.params.id
    const body: BlogInputType = req.body
    const isUpdated = await this.blogsService.updateBlog(id, body)
    if (!isUpdated) {
      res.status(HTTP_STATUSES.NOT_FOUND_404).json({ message: 'Blog not found' })
      return
    }
    res.status(HTTP_STATUSES.NO_CONTENT_204).send()
  }

  async deleteBlog(req: Request, res: Response) {
    const id = req.params.id

    const isDeleted = await this.blogsService.deleteBlog(id)
    if (!isDeleted) {
      res.status(HTTP_STATUSES.NOT_FOUND_404).json({ message: 'Blog not found' })
      return
    }
    res.status(HTTP_STATUSES.NO_CONTENT_204).send()
  }
}

export const blogController = new BlogController()

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
  blogController.createBlog.bind(blogController),
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
  blogController.updateBlog.bind(blogController),
)

blogRouter.delete(
  '/:id',
  authMiddleware,
  idParamValidator,
  errorsResultMiddleware,
  blogController.deleteBlog.bind(blogController),
)
