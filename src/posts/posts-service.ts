import { PaginatorPostType, PostInputType, PostType } from "../types/types"
import { postsRepository } from "./posts-repository"
import { blogsRepository } from "../blogs/blogs-repository"

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

  async createPost(postInput: PostInputType): Promise<PostType | null> {
    const blog = await blogsRepository.getBlogById(postInput.blogId)
    if (!blog) {
      return null
    }

    const newPost: PostType = {
      id: (Date.now() + Math.random()).toString(),
      title: postInput.title,
      shortDescription: postInput.shortDescription,
      content: postInput.content,
      blogId: postInput.blogId,
      blogName: blog.name, // Получаем название блога
      createdAt: new Date().toISOString(),
    }

    return await postsRepository.createPost(newPost)
  },

  async getPostById(id: string): Promise<PostType | null> {
    return await postsRepository.getPostById(id)
  },

  async updatePost(id: string, body: PostInputType): Promise<boolean> {
    return await postsRepository.updatePost(id, body)
  },

  async deletePost(id: string): Promise<boolean> {
    return await postsRepository.deletePost(id)
  },
}
