import { PostDBInsertType, PostInputType, PostType } from '../types/types'
import { blogsCollection, postsCollection } from '../db/mongoDb'
import { ObjectId, OptionalId } from 'mongodb'

export const postsRepository = {
  async createPost(post: PostDBInsertType): Promise<PostType> {
    const result = await postsCollection.insertOne(post as OptionalId<PostType>)

    return {
      id: result.insertedId.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
    }
    /* const blog: BlogType | null = await blogsCollection.findOne({
      _id: new ObjectId(post.blogId),
    })
    if (!blog) {
      throw new Error('Blog not found')
    }

    const newPost = {
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: blog.name,
      createdAt: new Date().toISOString(),
    }
    const result = await postsCollection.insertOne(
      newPost as OptionalId<PostType>,
    )

    return {
      id: result.insertedId.toString(),
      title: newPost.title,
      shortDescription: newPost.shortDescription,
      content: newPost.content,
      blogId: newPost.blogId,
      blogName: newPost.blogName,
      createdAt: newPost.createdAt,
    } as PostType*/
  },

  async getPostsForBlog(
    blogId: string,
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
  ): Promise<PostType[]> {
    const objectId = new ObjectId(blogId)

    return await postsCollection
      .find({ blogId: objectId.toString() })
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray()
  },

  async getPostsCountForBlog(blogId: string): Promise<number> {
    const objectId = new ObjectId(blogId)
    return await postsCollection.countDocuments({ blogId: objectId.toString() })
  },

  async updatePost(id: string, body: PostInputType): Promise<boolean> {
    const blog = await blogsCollection.findOne({
      _id: new ObjectId(body.blogId),
    })

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
          blogId: new ObjectId(body.blogId).toString(),
          blogName: blog?.name || 'Unknown Blog',
        },
      },
    )

    return result.matchedCount > 0
  },

  async deletePost(postId: string): Promise<boolean> {
    if (!ObjectId.isValid(postId)) {
      throw new Error('Invalid postId format')
    }
    const result = await postsCollection.deleteOne({
      _id: new ObjectId(postId),
    })
    return result.deletedCount > 0
  },
}
