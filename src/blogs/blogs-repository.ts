import { BlogInputModelType, BlogViewModelType } from "../types/types"
import { blogsCollection } from "../db/mongoDb"
import { ObjectId } from "mongodb"

export const blogsRepository = {
  async getBlogs(): Promise<BlogViewModelType[]> {
    return await blogsCollection.find({}, { projection: { _id: 0 } }).toArray()
  },

  async createBlog(body: BlogInputModelType): Promise<BlogViewModelType> {
    const newBlog: BlogViewModelType = {
      //_id: body._id ? body._id : undefined,
      id: (Date.now() + Math.random()).toString(),
      name: body.name,
      description: body.description,
      websiteUrl: body.websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: true,
    }

    await blogsCollection.insertOne(newBlog)

    return newBlog
  },

  async getBlogById(blogId: string): Promise<BlogViewModelType | null> {
    return await blogsCollection.findOne({ id: blogId }, { projection: { _id: 0 } })
  },

  async updateBlog(blogId: string, body: BlogInputModelType): Promise<boolean> {
    const result = await blogsCollection.updateOne(
      { id: blogId },
      { $set: { name: body.name, description: body.description, websiteUrl: body.websiteUrl } },
    )

    return result.matchedCount > 0
  },

  async deleteBlog(id: string): Promise<boolean> {
    const result = await blogsCollection.deleteOne({ id })
    return result.deletedCount > 0
  },
}
