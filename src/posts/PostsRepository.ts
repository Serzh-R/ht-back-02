import { PostDBModel, PostInputModel } from '../blogs/blog-post-types'
import { blogsCollection, postsCollection } from '../db/mongoDb'
import { ObjectId, WithId } from 'mongodb'

class PostsRepository {
  async createPost(post: PostDBModel): Promise<WithId<PostDBModel>> {
    const result = await postsCollection.insertOne(post as WithId<PostDBModel>)

    return {
      _id: result.insertedId,
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
    }
  }

  async updatePost(id: string, body: PostInputModel): Promise<boolean> {
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
  }

  async deletePost(postId: string): Promise<boolean> {
    if (!ObjectId.isValid(postId)) {
      throw new Error('Invalid postId format')
    }
    const result = await postsCollection.deleteOne({
      _id: new ObjectId(postId),
    })
    return result.deletedCount > 0
  }
}

export const postsRepository = new PostsRepository()
