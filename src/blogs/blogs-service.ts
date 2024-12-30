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
    const newBlog = await blogsRepository.createBlog(body)
    return newBlog
  },

  async getBlogById(id: string): Promise<BlogType | null> {
    const blogById = await blogsRepository.getBlogById(id)
    return blogById
  },

  async updateBlog(id: string, blogData: BlogInputType): Promise<boolean> {
    const isUpdated = await blogsRepository.updateBlog(id, blogData)
    return isUpdated
  },
}
