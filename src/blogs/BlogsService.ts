import { BlogsRepository } from './BlogsRepository'
import { BlogInputType, BlogType } from './blog-post-types'

export class BlogsService {
  blogsRepository: BlogsRepository
  constructor(blogsRepository: BlogsRepository) {
    this.blogsRepository = blogsRepository
  }
  async createBlog(body: BlogInputType): Promise<BlogType> {
    return await this.blogsRepository.createBlog(body)
  }

  async updateBlog(id: string, body: BlogInputType): Promise<boolean> {
    return await this.blogsRepository.updateBlog(id, body)
  }

  async deleteBlog(id: string): Promise<boolean> {
    return await this.blogsRepository.deleteBlog(id)
  }
}
