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
      return null
    }

    const newPost: PostDBInsertType = {
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: blog.name,
      createdAt: new Date().toISOString(),
    }

    const createdPost = await postsRepository.createPost(newPost)

    return this._getInView(createdPost)
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
      createdAt: new Date().toISOString(),
    }

    const createdPost = await postsRepository.createPost(newPost)

    return this._getInView(createdPost)
  },

  _getInView(post: PostDBType): PostType {
    return {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
    }
  },

  async updatePost(id: string, body: PostInputType): Promise<boolean> {
    return await postsRepository.updatePost(new ObjectId(id).toString(), body)
  },

  async deletePost(id: string): Promise<boolean> {
    return await postsRepository.deletePost(new ObjectId(id).toString())
  },

  /*async createPostForBlog(blogId: string, post: BlogPostInputType): Promise<PostType | null> {
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
  },*/

  /*async _createNewPost(post: Omit<PostType, 'id' | 'createdAt'>): Promise<PostType> {
    const newPost: PostDBInsertType = {
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: new Date().toISOString(),
    }

    return await postsRepository.createPost(newPost)
  },*/
}
