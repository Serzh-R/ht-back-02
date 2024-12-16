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
    }

    db.blogs[blogIndex] = {
      ...db.blogs[blogIndex],
      name: body.name,
      description: body.description,
      websiteUrl: body.websiteUrl,
    }
    return
  },

  deleteBlog(blogId: string) {
    const blogIndex = db.blogs.findIndex((blog) => blog.id === blogId)

    if (blogIndex === -1) {
      return false
    }

    db.blogs.splice(blogIndex, 1)
    return true
  },
}
