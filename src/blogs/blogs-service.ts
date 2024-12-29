import { blogsRepository } from "./blogs-repository"
import { PaginatorBlogType } from "../types/types"

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
}
