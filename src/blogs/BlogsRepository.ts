import { BlogInputType, BlogDBInsertType, BlogType } from '../types/types'
import { blogsCollection } from '../db/mongoDb'
import { ObjectId, OptionalId } from 'mongodb'

export const blogsRepository = {
  async createBlog(body: BlogInputType): Promise<BlogType> {
    const newBlog: BlogDBInsertType = {
      name: body.name ? body.name : '',
      description: body.description,
      websiteUrl: body.websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
    }

    const result = await blogsCollection.insertOne(
      newBlog as OptionalId<BlogType>,
    )

    return {
      id: result.insertedId.toString(),
      name: newBlog.name,
      description: newBlog.description,
      websiteUrl: newBlog.websiteUrl,
      createdAt: newBlog.createdAt,
      isMembership: newBlog.isMembership,
    } as BlogType
  },

  async updateBlog(id: string, body: BlogInputType): Promise<boolean> {
    if (!body.name || !body.description || !body.websiteUrl) {
      console.error('Invalid input data:', body)
      return false
    }

    const result = await blogsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: body.name,
          description: body.description,
          websiteUrl: body.websiteUrl,
        },
      },
    )

    return result.matchedCount > 0
  },

  async deleteBlog(id: string): Promise<boolean> {
    const result = await blogsCollection.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  },
}
