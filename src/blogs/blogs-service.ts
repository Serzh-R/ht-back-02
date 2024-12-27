import { SortDirectionsEnam } from "../types/types"
import { blogsRepository } from "./blogs-repository"

export const blogsService = {
  async getBlogs(
    searchNameTerm: string | null,
    sortBy: string,
    sortDirection: SortDirectionsEnam.ASC | SortDirectionsEnam.DESC,
    pageNumber: number,
    pageSize: number,
  ) {
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
