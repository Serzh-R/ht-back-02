import { BlogInputType, BlogType } from "../types/types"
import { blogsCollection } from "../db/mongoDb"

export const blogsRepository = {
  async getBlogs(): Promise<BlogType[]> {
    return await blogsCollection.find({}, { projection: { _id: 0 } }).toArray()
  },

  async createBlog(body: BlogInputType): Promise<BlogType> {
    const newBlog: BlogType = {
      id: (Date.now() + Math.random()).toString(),
      name: body.name ? body.name : "",
      description: body.description,
      websiteUrl: body.websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
    }

    await blogsCollection.insertOne(newBlog)

    const blog = await blogsCollection.findOne(
      { id: newBlog.id },
      { projection: { _id: 0 } },
    )

    return blog as BlogType
  },

  async getBlogById(id: string): Promise<BlogType | null> {
    return await blogsCollection.findOne({ id }, { projection: { _id: 0 } })
  },

  async updateBlog(blogId: string, body: BlogInputType): Promise<boolean> {
    if (!body.name || !body.description || !body.websiteUrl) {
      console.error("Invalid input data:", body)
      return false
    }
    /*const existingBlog = await blogsCollection.findOne({ id: blogId })
    if (!existingBlog) {
      return false
    }*/

    const result = await blogsCollection.updateOne(
      { id: blogId },
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
    const result = await blogsCollection.deleteOne({ id })
    return result.deletedCount > 0
  },
}
