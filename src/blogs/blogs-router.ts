import { Router, Request, Response } from "express"
import { HTTP_STATUSES } from "../settings"
import { BlogInputType, PostInputType } from "../types/types"
import {
  blogFieldsValidator,
  idParamValidator,
  postContentValidator,
  postShortDescriptionValidator,
  postTitleValidator,
} from "../validation/express-validator/field-validators"
import { errorsResultMiddleware } from "../validation/express-validator/errors-result-middleware"
import { authMiddleware } from "../middlewares/auth-middleware"
import { blogsService } from "./blogs-service"
import { paginationQueries } from "../helpers/paginations_values"
import { postsService } from "../posts/posts-service"
import { blogsRepository } from "./blogs-repository"

export const blogRouter = Router()

export const blogController = {
  async getBlogs(req: Request, res: Response) {
    const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize } =
      paginationQueries(req)

    const blogs = await blogsService.getBlogs(
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

  async createPostInBlogById(req: Request, res: Response): Promise<void> {
    const id = req.params.id
    const body: PostInputType = req.body

    const createdPost = await postsService.createPostForBlog(id, body)

    if (!createdPost) {
      res
        .status(HTTP_STATUSES.NOT_FOUND_404)
        .json({ message: "Blog not found", field: "id" })
      return
    }

    res.status(HTTP_STATUSES.CREATED_201).json(createdPost)
  },

  async getBlogById(req: Request, res: Response) {
    const id = req.params.id

    const blogById = await blogsService.getBlogById(id)
    if (!blogById) {
      res.status(HTTP_STATUSES.NOT_FOUND_404).json("Blog not found")
    } else {
      res.status(HTTP_STATUSES.OK_200).json(blogById)
    }
  },

  async getPostsInBlogById(req: Request, res: Response): Promise<void> {
    const blogId = req.params.id
    const { pageNumber, pageSize, sortBy, sortDirection } =
      paginationQueries(req)

    const blog = await blogsRepository.getBlogById(blogId)
    if (!blog) {
      res
        .status(HTTP_STATUSES.NOT_FOUND_404)
        .json({ message: "Blog not found", field: "id" })
      return
    }

    const posts = await postsService.getPostsForBlog(
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
      res.status(HTTP_STATUSES.NOT_FOUND_404).json("Blog not found")
    } else {
      res.status(HTTP_STATUSES.NO_CONTENT_204).send()
    }
  },

  async deleteBlog(req: Request, res: Response) {
    const id = req.params.id

    const isDeleted = await blogsService.deleteBlog(id)
    if (!isDeleted) {
      res.status(HTTP_STATUSES.NOT_FOUND_404).json("Blog not found")
    } else {
      res.status(HTTP_STATUSES.NO_CONTENT_204).send()
    }
  },
}

blogRouter.get("/", blogController.getBlogs)

blogRouter.get(
  "/:id/posts",
  blogFieldsValidator,
  idParamValidator,
  //blogIdValidator,
  errorsResultMiddleware,
  blogController.getPostsInBlogById,
)

blogRouter.post(
  "/",
  authMiddleware,
  blogFieldsValidator,
  errorsResultMiddleware,
  blogController.createBlog,
)

blogRouter.post(
  "/:id/posts",
  authMiddleware,
  idParamValidator,
  postTitleValidator,
  postShortDescriptionValidator,
  postContentValidator,
  errorsResultMiddleware,
  blogController.createPostInBlogById,
)

blogRouter.get(
  "/:id",
  idParamValidator,
  errorsResultMiddleware,
  blogController.getBlogById,
)

blogRouter.put(
  "/:id",
  authMiddleware,
  idParamValidator,
  blogFieldsValidator,
  errorsResultMiddleware,
  blogController.updateBlog,
)

blogRouter.delete(
  "/:id",
  authMiddleware,
  idParamValidator,
  errorsResultMiddleware,
  blogController.deleteBlog,
)

/*let searchNameTerm = req.query.searchNameTerm ? req.query.searchNameTerm.toString() : null
     let sortBy = req.query.sortBy ? req.query.sortBy.toString() : 'createdAt'
     let sortDirection: SortDirectionsEnam =
       req.query.sortDirection && req.query.sortDirection.toString() === SortDirectionsEnam.ASC
         ? SortDirectionsEnam.ASC
         : SortDirectionsEnam.DESC
     let pageNumber = req.query.pageNumber ? +req.query.pageNumber : 1
     let pageSize = req.query.pageSize ? + req.query.pageSize : 10*/

/*async getBlogs(req: Request, res: Response) {
    const blogs = await blogsRepository.getBlogs()
    res.status(HTTP_STATUSES.OK_200).json(blogs)
  },

  async createBlog(req: Request, res: Response) {
    const body: BlogInputType = req.body

    const newBlog = await blogsRepository.createBlog(body)
    res.status(HTTP_STATUSES.CREATED_201).json(newBlog)
  },

  async getBlogById(req: Request, res: Response) {
    const blogId = req.params.id

    const blogById = await blogsRepository.getBlogById(blogId)
    if (!blogById) {
      res.status(HTTP_STATUSES.NOT_FOUND_404).json("Blog not found")
    } else {
      res.status(HTTP_STATUSES.OK_200).json(blogById)
    }*/
