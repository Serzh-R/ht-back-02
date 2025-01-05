import { blogsRepository } from "./blogs-repository"
import { BlogInputType, BlogType, PaginatorBlogType } from "../types/types"

export const blogsService = {
  async getBlogs(
    searchNameTerm: string | null,
    sortBy: string,
    sortDirection: "asc" | "desc",
    pageNumber: number,
    pageSize: number,
  ): Promise<PaginatorBlogType> {
    const blogs = await blogsRepository.getBlogs(
      searchNameTerm,
      sortBy,
      sortDirection,
      pageNumber,
      pageSize,
    )
    const blogsCount = await blogsRepository.getBlogsCount(searchNameTerm)

    return {
      pagesCount: Math.ceil(blogsCount / pageSize),
      page: pageNumber,
      pageSize,
      totalCount: blogsCount,
      items: blogs,
    }
  },

  async createBlog(body: BlogInputType): Promise<BlogType> {
    return await blogsRepository.createBlog(body)
  },

  async getBlogById(id: string): Promise<BlogType | null> {
    return await blogsRepository.getBlogById(id)
  },

  async updateBlog(id: string, body: BlogInputType): Promise<boolean> {
    const isUpdated = await blogsRepository.updateBlog(id, body)
    return isUpdated
  },

  async deleteBlog(id: string): Promise<boolean> {
    const isDeleted = await blogsRepository.deleteBlog(id)
    return isDeleted
  },
}
