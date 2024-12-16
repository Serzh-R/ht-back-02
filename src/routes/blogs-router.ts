import { NextFunction, Router, Request, Response } from "express"
import { blogsRepository } from "../repositories/blogs-repository"
import { HTTP_STATUSES } from "../settings"
import { BlogInputModel } from "../types/types"
import {
  blogDescriptionValidator,
  blogNameValidator,
  blogWebsiteUrlValidator,
  idParamValidator,
} from "../validation/express-validator/field-validators"
import { errorsResultMiddleware } from "../validation/express-validator/errors-result-middleware"
import { authMiddleware } from "../middlewares/auth-middleware"

export const blogRouter = Router()

export const blogController = {
  getBlogs(req: Request, res: Response, next: NextFunction) {
    const blogs = blogsRepository.getBlogs()
    res.status(HTTP_STATUSES.OK_200).json(blogs)
  },

  createBlog(req: Request, res: Response) {
    const body: BlogInputModel = req.body

    const newBlog = blogsRepository.createBlog(body)
    res.status(HTTP_STATUSES.CREATED_201).json(newBlog)
  },

  getBlogById(req: Request, res: Response) {
    const blogId = req.params.id

    const blogById = blogsRepository.getBlogById(blogId)
    if (blogById) {
      res.status(HTTP_STATUSES.OK_200).json(blogById)
    } else {
      res.status(HTTP_STATUSES.NOT_FOUND_404).json({ error: "Blog not found." })
    }
  },

  updateBlog(req: Request, res: Response) {
    const blogId = req.params.id
    const body: BlogInputModel = req.body
    const isUpdated = blogsRepository.updateBlog(blogId, body)
    if (isUpdated) {
      res.status(HTTP_STATUSES.NO_CONTENT_204).send()
    } else {
      res.status(HTTP_STATUSES.NOT_FOUND_404).json({ error: "Blog not found." })
    }
  },

  deleteBlog(req: Request, res: Response) {
    const blogId = req.params.id

    const isDeleted = blogsRepository.deleteBlog(blogId)
    if (isDeleted) {
      res.status(HTTP_STATUSES.NO_CONTENT_204).send()
    } else {
      res.status(HTTP_STATUSES.NOT_FOUND_404).json({ error: "Blog not found." })
    }
  },
}

blogRouter.get("/", blogController.getBlogs)
blogRouter.post(
  "/",
  authMiddleware,
  blogNameValidator,
  blogDescriptionValidator,
  blogWebsiteUrlValidator,
  errorsResultMiddleware,
  blogController.createBlog,
)
blogRouter.get("/:id", idParamValidator, blogController.getBlogById)
blogRouter.put(
  "/:id",
  idParamValidator,
  authMiddleware,
  blogNameValidator,
  blogDescriptionValidator,
  blogWebsiteUrlValidator,
  errorsResultMiddleware,
  blogController.updateBlog,
)
blogRouter.delete("/:id", idParamValidator, authMiddleware, blogController.deleteBlog)
