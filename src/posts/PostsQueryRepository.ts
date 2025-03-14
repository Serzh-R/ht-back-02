import { PostViewModel, PaginatorPostViewModel, PostDB } from '../blogs/blog-post-types'
import { WithId } from 'mongodb'
import { PostModel } from './post-schema'

class PostsQueryRepository {
  async getPosts(
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
  ): Promise<PaginatorPostViewModel> {
    const totalCount = await PostModel.countDocuments()

    const posts = await PostModel.find()
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .select('-__v')
      .lean()

    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize,
      totalCount,
      items: posts.map(this._mapViewModel),
    }
  }

  async getPostById(postId: string): Promise<PostViewModel | null> {
    const post = await PostModel.findById(postId).select('-__v').lean()
    return post ? this._mapViewModel(post) : null
  }

  async getPostsForBlog(
    blogId: string,
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
  ): Promise<PaginatorPostViewModel> {
    const postsCount = await PostModel.countDocuments({ blogId })

    const posts = await PostModel.find({ blogId })
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .select('-__v')
      .lean()

    return {
      pagesCount: Math.ceil(postsCount / pageSize),
      page: pageNumber,
      pageSize,
      totalCount: postsCount,
      items: posts.map(this._mapViewModel),
    }
  }

  async getPostsCountForBlog(blogId: string): Promise<number> {
    return await PostModel.countDocuments({ blogId })
  }

  _mapViewModel(post: WithId<PostDB>): PostViewModel {
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
}

export const postsQueryRepository = new PostsQueryRepository()

// ************************************************************************* //

/*
import { PostViewModel, PaginatorPostViewModel, PostDB } from '../blogs/blog-post-types'
import { postsCollection } from '../db/mongoDb'
import { ObjectId, WithId } from 'mongodb'

class PostsQueryRepository {
  async getPosts(
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
  ): Promise<PaginatorPostViewModel> {
    const totalCount = await postsCollection.countDocuments()

    const posts = await postsCollection
      .find()
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray()

    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize,
      totalCount,
      items: posts.map((post) => this._mapViewModel(post)),
    }
  }

  async getPostById(postId: string): Promise<PostViewModel | null> {
    const post = await postsCollection.findOne({ _id: new ObjectId(postId) })
    return post ? this._mapViewModel(post) : null
  }

  async getPostsForBlog(
    blogId: string,
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
  ): Promise<PaginatorPostViewModel> {
    const postsCount = await postsCollection.countDocuments({ blogId })

    const posts = await postsCollection
      .find({ blogId })
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray()

    return {
      pagesCount: Math.ceil(postsCount / pageSize),
      page: pageNumber,
      pageSize,
      totalCount: postsCount,
      items: posts.map((post: WithId<PostDB>) => this._mapViewModel(post)),
    }
  }

  async getPostsCountForBlog(blogId: string): Promise<number> {
    const objectId = new ObjectId(blogId)
    return await postsCollection.countDocuments({ blogId: objectId.toString() })
  }

  _mapViewModel(post: WithId<PostDB>): PostViewModel {
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
}

export const postsQueryRepository = new PostsQueryRepository()
*/
