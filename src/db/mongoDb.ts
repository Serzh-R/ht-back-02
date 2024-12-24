import { SETTINGS } from "../settings"
import { MongoClient, Collection, Db } from "mongodb"
import { BlogViewModelType, PostViewModelType } from "../types/types"

export let blogsCollection: Collection<BlogViewModelType>
export let postsCollection: Collection<PostViewModelType>
export let client: MongoClient
export let mongoDb: Db

export async function runDb(url: string): Promise<boolean> {
  client = new MongoClient(url)
  mongoDb = client.db(SETTINGS.DB_NAME)

  blogsCollection = mongoDb.collection<BlogViewModelType>("blogs")
  postsCollection = mongoDb.collection<PostViewModelType>("posts")

  try {
    await client.connect()
    await mongoDb.command({ ping: 1 })
    console.log("Connected to MongoDB")
    return true
  } catch (err) {
    console.error("Error connecting to MongoDB:", err)
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
