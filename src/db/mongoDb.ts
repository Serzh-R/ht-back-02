import { SETTINGS } from '../settings'
import { MongoClient, Collection, Db } from 'mongodb'
import { BlogDBType, PostDBType } from '../types/types'
import { CommentDBType } from '../comments/types'
import { UserRegDBType } from '../auth/types/types'

export let blogsCollection: Collection<BlogDBType>
export let postsCollection: Collection<PostDBType>
export let usersCollection: Collection<UserRegDBType>
export let commentsCollection: Collection<CommentDBType>

export let client: MongoClient
export let mongoDb: Db

export async function runDb(url: string): Promise<boolean> {
  console.log(url, 'url')
  client = new MongoClient(url, {
    ssl: true, // Включение SSL
    tls: true, // Включение TLS
  })
  console.log(SETTINGS.DB_NAME, 'db_name')
  mongoDb = client.db(SETTINGS.DB_NAME)

  blogsCollection = mongoDb.collection<BlogDBType>('blogs')
  postsCollection = mongoDb.collection<PostDBType>('posts')
  usersCollection = mongoDb.collection<UserRegDBType>('users')
  commentsCollection = mongoDb.collection<CommentDBType>('comments')

  try {
    console.log('before connect')
    await client.connect()
    console.log(' client connected')
    await mongoDb.command({ ping: 1 })
    console.log('Connected to MongoDB')
    return true
  } catch (err) {
    console.log(err, 'error')
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
