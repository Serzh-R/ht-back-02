import {
  PaginatorPostType,
  PostDBInsertType,
  PostInputType,
  PostType,
} from '../types/types'
import { postsRepository } from './PostsRepository'
import { blogsQueryRepository } from '../blogs/BlogsQueryRepository'
import { ObjectId } from 'mongodb'

export const postsService = {
  async createPost(post: PostInputType): Promise<PostType | null> {
    const blog = await blogsQueryRepository.getBlogById(post.blogId)
    if (!blog) {
      return null
    }

    return await this._createNewPost({
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: blog.name,
    })
  },

  async createPostForBlog(blogId: string, post: PostInputType) {
    const blog = await blogsQueryRepository.getBlogById(blogId)
    if (!blog) {
      return null
    }

    return await this._createNewPost({
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: blogId,
      blogName: blog.name,
    })
  },

  async _createNewPost(
    post: Omit<PostType, 'id' | 'createdAt'>,
  ): Promise<PostType> {
    const newPost: PostDBInsertType = {
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: new Date().toISOString(),
    }

    return await postsRepository.createPost(newPost)
  },

  async getPostsForBlog(
    blogId: string,
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
  ): Promise<PaginatorPostType> {
    const posts = await postsRepository.getPostsForBlog(
      new ObjectId(blogId).toString(),
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
    )

    const postsCount = await postsRepository.getPostsCountForBlog(
      new ObjectId(blogId).toString(),
    )

    return {
      pagesCount: Math.ceil(postsCount / pageSize),
      page: pageNumber,
      pageSize,
      totalCount: postsCount,
      items: posts,
    }
  },

  async updatePost(id: string, body: PostInputType): Promise<boolean> {
    return await postsRepository.updatePost(new ObjectId(id).toString(), body)
  },

  async deletePost(id: string): Promise<boolean> {
    return await postsRepository.deletePost(new ObjectId(id).toString())
  },
}
