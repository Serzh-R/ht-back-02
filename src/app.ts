import express, { Request, Response } from "express"
import cors from "cors"
import { HTTP_STATUSES, SETTINGS } from "./settings"
import { db } from "./db/db"
import { blogRouter } from "./blogs/blogs-router"
import { postRouter } from "./posts/posts-router"

export const app = express()
app.use(express.json())
app.use(cors())
app.use(SETTINGS.PATH.BLOGS, blogRouter)
app.use(SETTINGS.PATH.POSTS, postRouter)

app.delete(SETTINGS.PATH.DELETE_ALL, (req: Request, res: Response) => {
  db.blogs = []
  db.posts = []

  res.status(HTTP_STATUSES.NO_CONTENT_204).send()
})

app.get("/", (req: Request, res: Response) => {
  res.status(HTTP_STATUSES.OK_200).json("Ciao HT-BACK-02!")
})
