import { PostDBInsertType, PostInputType, PostType } from '../types/types'
import { blogsCollection, postsCollection } from '../db/mongoDb'
import { ObjectId } from 'mongodb'

export const postsRepository = {
  async createPost(post: PostDBInsertType): Promise<PostType> {
    const result = await postsCollection.insertOne({
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: new Date().toISOString(),
    })

    return {
      id: result.insertedId.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
    } as PostType
  },

  async getPostsForBlog(
    blogId: string,
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
  ): Promise<PostType[]> {
    return await postsCollection
      .find({ blogId }, { projection: { _id: 0 } })
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray()
  },

  async getPostsCountForBlog(blogId: string): Promise<number> {
    return await postsCollection.countDocuments({ blogId })
  },

  async updatePost(id: string, body: PostInputType): Promise<boolean> {
    const blog = await blogsCollection.findOne({ id: body.blogId })

    if (!blog) {
      throw new Error('Blog not found')
    }

    const result = await postsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title: body.title,
          shortDescription: body.shortDescription,
          content: body.content,
          blogId: body.blogId,
          blogName: blog?.name || 'Unknown Blog',
        },
      },
    )

    return result.matchedCount > 0
  },

  async deletePost(postId: string): Promise<boolean> {
    const result = await postsCollection.deleteOne({
      _id: new ObjectId(postId),
    })
    return result.deletedCount > 0
  },
}
