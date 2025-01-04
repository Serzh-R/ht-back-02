import { BlogInputType, BlogType } from "../types/types"
import { blogsCollection } from "../db/mongoDb"

export const blogsRepository = {
  async getBlogs(
    searchNameTerm: string | null,
    sortBy: string,
    sortDirection: "asc" | "desc",
    pageNumber: number,
    pageSize: number,
  ): Promise<BlogType[]> {
    const filter: any = {}

    if (searchNameTerm) {
      filter.name = { $regex: searchNameTerm, $options: "i" }
    }

    return await blogsCollection
      .find(filter, { projection: { _id: 0 } })
      .sort({ [sortBy]: sortDirection === "asc" ? 1 : -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray()
  },

  async getBlogsCount(searchNameTerm: string | null): Promise<number> {
    const filter: any = {}
    if (searchNameTerm) {
      filter.name = { $regex: searchNameTerm, $options: "i" }
    }
    return blogsCollection.countDocuments(filter)
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

  async updateBlog(id: string, body: BlogInputType): Promise<boolean> {
    if (!body.name || !body.description || !body.websiteUrl) {
      console.error("Invalid input data:", body)
      return false
    }

    const result = await blogsCollection.updateOne(
      { id },
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
