import { Router, Request, Response } from "express"
import { blogsRepository } from "./blogs-repository"
import { HTTP_STATUSES } from "../settings"
import { BlogInputModelType } from "../types/types"
import {
  //blogDescriptionValidator,
  blogFieldsValidator,
  //blogNameValidator,
  //blogWebsiteUrlValidator,
  idParamValidator,
} from "../validation/express-validator/field-validators"
import { errorsResultMiddleware } from "../validation/express-validator/errors-result-middleware"
import { authMiddleware } from "../middlewares/auth-middleware"

export const blogRouter = Router()

export const blogController = {
  async getBlogs(req: Request, res: Response) {
    const blogs = await blogsRepository.getBlogs()
    res.status(HTTP_STATUSES.OK_200).json(blogs)
  },

  createBlog(req: Request, res: Response) {
    const body: BlogInputModelType = req.body

    const newBlog = blogsRepository.createBlog(body)
    res.status(HTTP_STATUSES.CREATED_201).json(newBlog)
  },

  getBlogById(req: Request, res: Response) {
    const blogId = req.params.id

    const blogById = blogsRepository.getBlogById(blogId)
    if (!blogById) {
      res.status(HTTP_STATUSES.NOT_FOUND_404).json("Blog not found")
    } else {
      res.status(HTTP_STATUSES.OK_200).json(blogById)
    }
  },

  updateBlog(req: Request, res: Response) {
    const blogId = req.params.id
    const body: BlogInputModelType = req.body
    const isUpdated = blogsRepository.updateBlog(blogId, body)
    if (!isUpdated) {
      res.status(HTTP_STATUSES.NOT_FOUND_404).json("Blog not found")
    } else {
      res.status(HTTP_STATUSES.NO_CONTENT_204).send()
    }
  },

  deleteBlog(req: Request, res: Response) {
    const id = req.params.id

    const isDeleted = blogsRepository.deleteBlog(id)
    if (!isDeleted) {
      res.status(HTTP_STATUSES.NOT_FOUND_404).json("Blog not found")
    } else {
      res.status(HTTP_STATUSES.NO_CONTENT_204).send()
    }
  },
}

blogRouter.get("/", blogController.getBlogs)
blogRouter.post("/", authMiddleware, blogFieldsValidator, errorsResultMiddleware, blogController.createBlog)
blogRouter.get("/:id", idParamValidator, errorsResultMiddleware, blogController.getBlogById)
blogRouter.put(
  "/:id",
  authMiddleware,
  idParamValidator,
  blogFieldsValidator,
  errorsResultMiddleware,
  blogController.updateBlog,
)
blogRouter.delete("/:id", authMiddleware, idParamValidator, errorsResultMiddleware, blogController.deleteBlog)
