import { blogsRepository } from './BlogsRepository'
import { BlogInputType, BlogType } from './blog-post-types'

class BlogsService {
  async createBlog(body: BlogInputType): Promise<BlogType> {
    return await blogsRepository.createBlog(body)
  }

  async updateBlog(id: string, body: BlogInputType): Promise<boolean> {
    return await blogsRepository.updateBlog(id, body)
  }

  async deleteBlog(id: string): Promise<boolean> {
    return await blogsRepository.deleteBlog(id)
  }
}

export const blogsService = new BlogsService()
