import { SETTINGS } from "../settings"
import { MongoClient, Collection } from "mongodb"
import { BlogViewModelType, PostViewModelType } from "../types/types"

export let blogsCollection: Collection<BlogViewModelType>
export let postsCollection: Collection<PostViewModelType>

export async function runDb(url: string): Promise<boolean> {
  let client = new MongoClient(url)
  let db = client.db(SETTINGS.DB_NAME)

  blogsCollection = db.collection<BlogViewModelType>(SETTINGS.PATH.BLOGS)
  postsCollection = db.collection<PostViewModelType>(SETTINGS.PATH.POSTS)

  try {
    await client.connect()
    await db.command({ ping: 1 })
    console.log("Connected to MongoDB")
    return true
  } catch (err) {
    console.log(err)
    await client.close()
    return false
  }
}
