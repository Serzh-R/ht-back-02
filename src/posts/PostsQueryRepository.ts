import { PostViewModel, PaginatorPostViewModel, PostDBModel } from '../blogs/blog-post-types'
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
      items: posts.map((post: WithId<PostDBModel>) => this._mapViewModel(post)),
    }
  }

  async getPostsCountForBlog(blogId: string): Promise<number> {
    const objectId = new ObjectId(blogId)
    return await postsCollection.countDocuments({ blogId: objectId.toString() })
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

  /*_checkObjectId(id: string): boolean {
    return ObjectId.isValid(id)
  },*/
}

export const postsQueryRepository = new PostsQueryRepository()
