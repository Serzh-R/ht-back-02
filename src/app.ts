import express, { Request, Response } from 'express'
import cors from 'cors'
import { HTTP_STATUSES, SETTINGS } from './settings'
import { blogRouter } from './blogs/BlogsRouter'
import { postRouter } from './posts/PostsRouter'
import { blogsCollection, postsCollection, usersCollection } from './db/mongoDb'
import { usersRouter } from './users/UsersRouter'
import { authRouter } from './auth/AuthRouter'
import { commentsRouter } from './comments/CommentsRouter'

export const app = express()

const jsonBodyMiddleware = express.json()

app.use(jsonBodyMiddleware)
app.use(cors())
app.use(SETTINGS.PATH.BLOGS, blogRouter)
app.use(SETTINGS.PATH.POSTS, postRouter)
app.use(SETTINGS.PATH.AUTH, authRouter)
app.use(SETTINGS.PATH.USERS, usersRouter)
app.use(SETTINGS.PATH.COMMENTS, commentsRouter)

app.delete(SETTINGS.PATH.DELETE_ALL, async (req: Request, res: Response) => {
  try {
    await blogsCollection.deleteMany({})
    await postsCollection.deleteMany({})
    await usersCollection.deleteMany({})

    res.status(HTTP_STATUSES.NO_CONTENT_204).send()
  } catch (error) {
    console.error('Error clearing data:', error)
    res.status(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500).json({ error: 'Failed to clear data' })
  }
})

app.get('/', (req: Request, res: Response) => {
  res.status(HTTP_STATUSES.OK_200).json('Ciao HT-BACK-02!')
})
