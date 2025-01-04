import { PaginatorPostType } from "../types/types"
import { postsRepository } from "./posts-repository"

export const postsService = {
  async getPosts(
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: "asc" | "desc",
  ): Promise<PaginatorPostType> {
    const posts = await postsRepository.getPosts(
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
    )
    const postsCount = await postsRepository.getPostsCount()

    return {
      pagesCount: Math.ceil(postsCount / pageSize),
      page: pageNumber,
      pageSize,
      totalCount: postsCount,
      items: posts,
    }
  },
}
