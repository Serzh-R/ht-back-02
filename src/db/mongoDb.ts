import { SETTINGS } from "../settings"
import { MongoClient, Collection } from "mongodb"
import { BlogViewModelType, DBType, PostViewModelType } from "../types/types"

export let blogsCollection: Collection<BlogViewModelType>
export let postsCollection: Collection<PostViewModelType>

export async function runDb(url: string): Promise<boolean> {
  let client = new MongoClient(url)
  let mongoDb = client.db(SETTINGS.DB_NAME)

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

export const setDB = async (dataset?: Partial<DBType>) => {
  await blogsCollection.deleteMany({})
  await postsCollection.deleteMany({})

  if (!dataset) return

  if (dataset.blogs) {
    await blogsCollection.insertMany(dataset.blogs)
  }
  if (dataset.posts) {
    await postsCollection.insertMany(dataset.posts)
  }
}
