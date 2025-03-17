import { SETTINGS } from '../settings'
import mongoose from 'mongoose'

export async function runDb(url: string): Promise<boolean> {
  console.log('MongoDB connection URL:', url)

  try {
    await mongoose.connect(url, {
      dbName: SETTINGS.DB_NAME, // ✅ Фикс подключения
      writeConcern: { w: 'majority' },
    })

    console.log('Connected successfully to Mongo server')
    return true
  } catch (err) {
    console.log(err, 'error')
    console.error('Error connecting to MongoDB:', err)
    await mongoose.disconnect()
    return false
  }
}

// ************************************************************************* //

/*import { SETTINGS } from '../settings'
import { MongoClient, Collection, Db, WithId } from 'mongodb'
import { BlogDBType, PostDBModel } from '../blogs/blog-post-types'
import { CommentDBType } from '../comments/comment-types'
import { BlacklistDBType, UserRegDBType } from '../users/user-types'
import { AppealToApi, DeviceSessionDB } from '../devices/device-types'

export let blogsCollection: Collection<BlogDB>
export let postsCollection: Collection<WithId<PostDB>>
export let usersCollection: Collection<UserRegDB>
export let commentsCollection: Collection<CommentDB>
export let blacklistCollection: Collection<BlacklistDB>
export let deviceSessionsCollection: Collection<WithId<DeviceSessionDB>>
export let requestsCollection: Collection<AppealToApi>

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

  blogsCollection = mongoDb.collection<BlogDB>('blogs')
  postsCollection = mongoDb.collection<WithId<PostDB>>('posts')
  usersCollection = mongoDb.collection<UserRegDB>('users')
  commentsCollection = mongoDb.collection<CommentDB>('comments')
  blacklistCollection = mongoDb.collection<BlacklistDB>('blacklist')
  deviceSessionsCollection = mongoDb.collection<WithId<DeviceSessionDB>>('sessions')
  requestsCollection = mongoDb.collection<AppealToApi>('requests')

  try {
    await client.connect()
    await mongoDb.command({ ping: 1 })
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
}*/

// ********************************************************************** //

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
