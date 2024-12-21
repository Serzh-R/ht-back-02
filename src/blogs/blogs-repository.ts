import { BlogInputModelType, BlogViewModelType } from "../types/types"
import { blogsCollection } from "../db/mongoDb"

export const blogsRepository = {
  async getBlogs(): Promise<BlogViewModelType[]> {
    return await blogsCollection.find().toArray()
  },

  async createBlog(body: BlogInputModelType): Promise<BlogViewModelType> {
    const newBlog: BlogViewModelType = {
      id: (Date.now() + Math.random()).toString(),
      name: body.name,
      description: body.description,
      websiteUrl: body.websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
    }

    await blogsCollection.insertOne(newBlog) // Добавление в коллекцию MongoDB
    return newBlog
  },

  async getBlogById(blogId: string): Promise<BlogViewModelType | null> {
    return await blogsCollection.findOne({ id: blogId }) // Поиск блога по ID
    //return (await db.blogs.find((blog) => blog.id === blogId)) || null
  },

  async updateBlog(blogId: string, body: BlogInputModelType): Promise<boolean> {
    const result = await blogsCollection.updateOne(
      { id: blogId },
      { $set: { name: body.name, description: body.description, websiteUrl: body.websiteUrl } },
    )

    return result.matchedCount > 0 // Возвращает true, если обновление успешно
  },

  async deleteBlog(id: string): Promise<boolean> {
    const result = await blogsCollection.deleteOne({ id })
    return result.deletedCount > 0 // Возвращает true, если удаление успешно
  },
}
