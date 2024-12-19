import { db } from "../db/db"
import { BlogInputModelType, BlogViewModelType } from "../types/types"
import { blogsCollection } from "../db/mongoDb"

export const blogsRepository = {
  async getBlogs(): Promise<BlogViewModelType[]> {
    return await blogsCollection.find().toArray()
    //return await db.blogs
  },

  createBlog(body: BlogInputModelType) {
    const newBlog: BlogViewModelType = {
      id: (Date.now() + Math.random()).toString(),
      name: body.name,
      description: body.description,
      websiteUrl: body.websiteUrl,
    }

    db.blogs = [...db.blogs, newBlog]
    return newBlog
  },

  getBlogById(blogId: string) {
    return db.blogs.find((blog) => blog.id === blogId) || null
  },

  updateBlog(blogId: string, body: BlogInputModelType) {
    const blogIndex = db.blogs.findIndex((blog) => blog.id === blogId)

    if (blogIndex === -1) {
      return false
    } else {
      db.blogs[blogIndex] = {
        ...db.blogs[blogIndex],
        name: body.name,
        description: body.description,
        websiteUrl: body.websiteUrl,
      }
    }
    return true
  },

  deleteBlog(id: string) {
    const initialLength = db.blogs.length
    db.blogs = db.blogs.filter((blog) => blog.id !== id)
    return db.blogs.length < initialLength
  },
}
