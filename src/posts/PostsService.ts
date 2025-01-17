import {
  BlogPostInputType,
  PostDBInsertType,
  PostDBType,
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
      throw new Error('Invalid blogId')
    }

    const newPost: PostDBInsertType = {
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: blog.name,
      createdAt: new Date(),
    }

    const createdPost = await postsRepository.createPost(newPost)

    return this._mapViewModel(createdPost)
  },

  async createPostForBlog(blogId: string, post: BlogPostInputType): Promise<PostType | null> {
    const blog = await blogsQueryRepository.getBlogById(blogId)
    if (!blog) {
      return null
    }

    const newPost: PostDBInsertType = {
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: blogId,
      blogName: blog.name,
      createdAt: new Date(),
    }

    const createdPost = await postsRepository.createPost(newPost)

    return this._mapViewModel(createdPost)
  },

  _mapViewModel(post: PostDBType): PostType {
    return {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt.toISOString(),
    }
  },

  async updatePost(id: string, body: PostInputType): Promise<boolean> {
    return await postsRepository.updatePost(new ObjectId(id).toString(), body)
  },

  async deletePost(id: string): Promise<boolean> {
    return await postsRepository.deletePost(new ObjectId(id).toString())
  },
}
