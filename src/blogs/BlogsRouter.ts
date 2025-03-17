import { Router } from 'express'
import {
  blogFieldsValidator,
  idParamValidator,
  postContentValidator,
  postShortDescriptionValidator,
  postTitleValidator,
} from '../validation/express-validator/field.validators'
import { errorsResultMiddleware } from '../validation/express-validator/errors.result.middleware'
import { authMiddleware } from '../auth/middlewares/auth.middleware'
import { container } from '../composition-root'
import { BlogsController } from './BlogsController'

const blogsController = container.get<BlogsController>(BlogsController)

export const blogRouter = Router()

blogRouter.get('/', blogsController.getBlogs.bind(blogsController))

blogRouter.get(
  '/:id/posts',
  idParamValidator,
  errorsResultMiddleware,
  blogsController.getPostsForBlog,
)

blogRouter.post(
  '/',
  authMiddleware,
  blogFieldsValidator,
  errorsResultMiddleware,
  blogsController.createBlog.bind(blogsController),
)

blogRouter.post(
  '/:id/posts',
  authMiddleware,
  idParamValidator,
  postTitleValidator,
  postShortDescriptionValidator,
  postContentValidator,
  errorsResultMiddleware,
  blogsController.createPostForBlog,
)

blogRouter.get('/:id', idParamValidator, errorsResultMiddleware, blogsController.getBlogById)

blogRouter.put(
  '/:id',
  authMiddleware,
  idParamValidator,
  blogFieldsValidator,
  errorsResultMiddleware,
  blogsController.updateBlog.bind(blogsController),
)

blogRouter.delete(
  '/:id',
  authMiddleware,
  idParamValidator,
  errorsResultMiddleware,
  blogsController.deleteBlog.bind(blogsController),
)
