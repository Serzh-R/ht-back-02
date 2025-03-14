import { BlogsRepository } from './BlogsRepository'
import { BlogInputType, Blog } from './blog-post-types'
import { inject, injectable } from 'inversify'

@injectable()
export class BlogsService {
  constructor(@inject(BlogsRepository) private blogsRepository: BlogsRepository) {}

  async createBlog(body: BlogInputType): Promise<Blog> {
    return await this.blogsRepository.createBlog(body)
  }

  async updateBlog(id: string, body: BlogInputType): Promise<boolean> {
    return await this.blogsRepository.updateBlog(id, body)
  }

  async deleteBlog(id: string): Promise<boolean> {
    return await this.blogsRepository.deleteBlog(id)
  }
}
