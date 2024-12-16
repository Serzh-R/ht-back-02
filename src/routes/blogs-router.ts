import { NextFunction, Router, Request, Response } from "express"
import { blogsRepository } from "../repositories/blogs-repository"
import { HTTP_STATUSES } from "../settings"
import { BlogInputModel } from "../types/types"
import {
  blogDescriptionValidator,
  blogNameValidator,
  blogWebsiteUrlValidator,
} from "../validation/express-validator/field-validators"
import { errorsResultMiddleware } from "../validation/express-validator/errors-result-middleware"

export const blogRouter = Router()

export const blogController = {
  getBlogs(req: Request, res: Response, next: NextFunction) {
    const blogs = blogsRepository.getBlogs()
    res.status(HTTP_STATUSES.OK_200).json(blogs)
  },

  createBlog(req: Request, res: Response, next: NextFunction) {
    const body: BlogInputModel = req.body

    const newBlog = blogsRepository.createBlog(body)
    res.status(HTTP_STATUSES.CREATED_201).json(newBlog)
  },

  getBlogById(req: Request, res: Response, next: NextFunction) {
    const blogId = req.params.id

    const blogById = blogsRepository.getBlogById(blogId)
    res.status(HTTP_STATUSES.OK_200).json(blogById)
  },

  updateBlog(req: Request, res: Response, next: NextFunction) {
    const blogId = req.params.id
    const body: BlogInputModel = req.body
    blogsRepository.updateBlog(blogId, body)
    res.status(HTTP_STATUSES.NO_CONTENT_204).send()
  },

  deleteBlog(req: Request, res: Response, next: NextFunction) {
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
  blogNameValidator,
  blogDescriptionValidator,
  blogWebsiteUrlValidator,
  errorsResultMiddleware,
  blogController.createBlog,
)
blogRouter.get("/:id", blogController.getBlogById)
blogRouter.put(
  "/:id",
  blogNameValidator,
  blogDescriptionValidator,
  blogWebsiteUrlValidator,
  errorsResultMiddleware,
  blogController.updateBlog,
)
blogRouter.delete("/:id", blogController.deleteBlog)
