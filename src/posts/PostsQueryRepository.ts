import { PostType, PaginatorPostType, PostDBType } from '../types/types'
import { postsCollection } from '../db/mongoDb'
import { ObjectId, WithId } from 'mongodb'

export const postsQueryRepository = {
  async getPosts(
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
  ): Promise<PaginatorPostType> {
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
      items: posts.map((post) => this._getInView(post)),
    }
  },

  async getPostById(postId: string): Promise<PostType | null> {
    const post = await postsCollection.findOne({ _id: new ObjectId(postId) })
    return post ? this._getInView(post) : null
  },

  _getInView(post: WithId<PostDBType>): PostType {
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

  _checkObjectId(id: string): boolean {
    return ObjectId.isValid(id)
  },
}