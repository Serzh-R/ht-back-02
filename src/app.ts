import express, { Request, Response } from "express"
import cors from "cors"
import { HTTP_STATUSES, SETTINGS } from "./settings"
import { db } from "./db/db"
import { blogRouter } from "./blogs/blogs-router"
import { postRouter } from "./posts/posts-router"
import { blogsCollection, postsCollection } from "./db/mongoDb"

export const app = express()

const jsonBodyMiddleware = express.json()

app.use(jsonBodyMiddleware)
app.use(cors())
app.use(SETTINGS.PATH.BLOGS, blogRouter)
app.use(SETTINGS.PATH.POSTS, postRouter)

app.delete(SETTINGS.PATH.DELETE_ALL, async (req: Request, res: Response) => {
  try {
    await blogsCollection.deleteMany({})
    await postsCollection.deleteMany({})

    res.status(HTTP_STATUSES.NO_CONTENT_204).send()
  } catch (error) {
    console.error("Error clearing data:", error)
    res.status(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500).json({ error: "Failed to clear data" })
  }
})

app.get("/", (req: Request, res: Response) => {
  res.status(HTTP_STATUSES.OK_200).json("Ciao HT-BACK-02!")
})
