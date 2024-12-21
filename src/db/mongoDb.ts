import { SETTINGS } from "../settings"
import { MongoClient, Collection } from "mongodb"
import { BlogViewModelType, PostViewModelType } from "../types/types"

export let blogsCollection: Collection<BlogViewModelType>
export let postsCollection: Collection<PostViewModelType>

export async function runDb(url: string): Promise<boolean> {
  let client = new MongoClient(url)
  let mongoDb = client.db(SETTINGS.DB_NAME)

  blogsCollection = mongoDb.collection<BlogViewModelType>(SETTINGS.PATH.BLOGS)
  postsCollection = mongoDb.collection<PostViewModelType>(SETTINGS.PATH.POSTS)

  try {
    await client.connect()
    await mongoDb.command({ ping: 1 })
    console.log("Connected to MongoDB")
    return true
  } catch (err) {
    console.log(err)
    await client.close()
    return false
  }
}
