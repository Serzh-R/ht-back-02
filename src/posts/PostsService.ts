import {
  BlogPostInputModel,
  PostDBModel,
  PostInputModel,
  PostViewModel,
} from '../blogs/blog-post-types'
import { postsRepository } from './PostsRepository'
import { blogsQueryRepository } from '../blogs/BlogsQueryRepository'
import { ObjectId, WithId } from 'mongodb'

class PostsService {
  async createPost(post: PostInputModel): Promise<PostViewModel | null> {
    const blog = await blogsQueryRepository.getBlogById(post.blogId)
    if (!blog) {
      throw new Error('Invalid blogId')
    }

    const newPost: PostDBModel = {
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: blog.name,
      createdAt: new Date(),
    }

    const createdPost = await postsRepository.createPost(newPost)

    return this._mapViewModel(createdPost as WithId<PostDBModel>)
  }

  async createPostForBlog(blogId: string, post: BlogPostInputModel): Promise<PostViewModel | null> {
    const blog = await blogsQueryRepository.getBlogById(blogId)
    if (!blog) {
      return null
    }

    const newPost: PostDBModel = {
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: blogId,
      blogName: blog.name,
      createdAt: new Date(),
    }

    const createdPost = await postsRepository.createPost(newPost)

    return this._mapViewModel(createdPost as WithId<PostDBModel>)
  }

  _mapViewModel(post: WithId<PostDBModel>): PostViewModel {
    return {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt.toISOString(),
    }
  }

  async updatePost(id: string, body: PostInputModel): Promise<boolean> {
    return await postsRepository.updatePost(new ObjectId(id).toString(), body)
  }

  async deletePost(id: string): Promise<boolean> {
    return await postsRepository.deletePost(new ObjectId(id).toString())
  }
}

export const postsService = new PostsService()
