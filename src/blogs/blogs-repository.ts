import { db } from "../db/db"
import { BlogInputModel, BlogViewModel } from "../types/types"

export const blogsRepository = {
  getBlogs(): BlogViewModel[] {
    return db.blogs
  },

  createBlog(body: BlogInputModel) {
    const newBlog: BlogViewModel = {
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

  updateBlog(blogId: string, body: BlogInputModel) {
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
