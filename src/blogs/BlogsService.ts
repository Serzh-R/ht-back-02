import { BlogsRepository } from './BlogsRepository'
import { BlogInputType, BlogType } from './blog-post-types'
import { injectable } from 'inversify'
import 'reflect-metadata'

@injectable()
export class BlogsService {
  constructor(protected blogsRepository: BlogsRepository) {}

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
