import { SETTINGS } from '../settings'
import { MongoClient, Collection, Db } from 'mongodb'
import { BlogDBType, PostDBType, UserDBType } from '../types/types'
import { CommentDBType } from '../comments/types'

export let blogsCollection: Collection<BlogDBType>
export let postsCollection: Collection<PostDBType>
export let usersCollection: Collection<UserDBType>
export let commentsCollection: Collection<CommentDBType>

export let client: MongoClient
export let mongoDb: Db

export async function runDb(url: string): Promise<boolean> {
  client = new MongoClient(url)
  mongoDb = client.db(SETTINGS.DB_NAME)

  blogsCollection = mongoDb.collection<BlogDBType>('blogs')
  postsCollection = mongoDb.collection<PostDBType>('posts')
  usersCollection = mongoDb.collection<UserDBType>('users')
  commentsCollection = mongoDb.collection<CommentDBType>('comments')

  try {
    await client.connect()
    await mongoDb.command({ ping: 1 })
    console.log('Connected to MongoDB')
    return true
  } catch (err) {
    console.error('Error connecting to MongoDB:', err)
    await client.close()
    return false
  }
}

//Эта функция предназначена для остановки продакшн- или тестовой базы данных в зависимости от вызванного контекста (runDb)
export const stopDb = async () => {
  await client.close()
}

/*export const setDB = async (dataset?: Partial<DBType>) => {
  await blogsCollection.deleteMany({})
  await postsCollection.deleteMany({})

  if (!dataset) return

  if (dataset.blogs) {
    await blogsCollection.insertMany(dataset.blogs)
  }
  if (dataset.posts) {
    await postsCollection.insertMany(dataset.posts)
  }
}*/
