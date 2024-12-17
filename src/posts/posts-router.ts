import { Router, Request, Response } from "express"
import { postsRepository } from "./posts-repository"
import { HTTP_STATUSES } from "../settings"
import { PostInputModel } from "../types/types"
import {
  blogIdValidator,
  idParamValidator,
  postContentValidator,
  postShortDescriptionValidator,
  postTitleValidator,
} from "../validation/express-validator/field-validators"
import { errorsResultMiddleware } from "../validation/express-validator/errors-result-middleware"
import { authMiddleware } from "../middlewares/auth-middleware"

export const postRouter = Router()

export const postController = {
  getPosts(req: Request, res: Response) {
    const posts = postsRepository.getPosts()
    res.status(HTTP_STATUSES.OK_200).json(posts)
  },

  createPost(req: Request, res: Response) {
    const body: PostInputModel = req.body

    const newPost = postsRepository.createPost(body)
    res.status(HTTP_STATUSES.CREATED_201).json(newPost)
  },

  getPostById(req: Request, res: Response) {
    const postId = req.params.id

    const postById = postsRepository.getPostById(postId)
    if (!postById) {
      res.status(HTTP_STATUSES.NOT_FOUND_404).json("Post not found")
    } else {
      res.status(HTTP_STATUSES.OK_200).json(postById)
    }
  },

  updatePost(req: Request, res: Response) {
    const postId = req.params.id
    const body = req.body
    const isUpdated = postsRepository.updatePost(postId, body)
    if (!isUpdated) {
      res.status(HTTP_STATUSES.NOT_FOUND_404).json("Post not found")
    } else {
      res.status(HTTP_STATUSES.NO_CONTENT_204).send()
    }
  },

  deletePost(req: Request, res: Response) {
    const postId = req.params.id

    const isDeleted = postsRepository.deletePost(postId)
    if (!isDeleted) {
      res.status(HTTP_STATUSES.NOT_FOUND_404).json("Post not found")
    } else {
      res.status(HTTP_STATUSES.NO_CONTENT_204).send()
    }
  },
}

postRouter.get("/", postController.getPosts)
postRouter.post(
  "/",
  authMiddleware,
  postTitleValidator,
  postShortDescriptionValidator,
  postContentValidator,
  blogIdValidator,
  errorsResultMiddleware,
  postController.createPost,
)
postRouter.get("/:id", idParamValidator, postController.getPostById)
postRouter.put(
  "/:id",
  authMiddleware,
  idParamValidator,
  postTitleValidator,
  postShortDescriptionValidator,
  postContentValidator,
  blogIdValidator,
  errorsResultMiddleware,
  postController.updatePost,
)
postRouter.delete("/:id", authMiddleware, idParamValidator, postController.deletePost)
