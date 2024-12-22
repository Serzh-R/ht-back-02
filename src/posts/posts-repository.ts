import { PostInputModelType, PostViewModelType } from "../types/types"
import { blogsCollection, postsCollection } from "../db/mongoDb"

export const postsRepository = {
  async getPosts(): Promise<PostViewModelType[]> {
    return await postsCollection.find().toArray()
  },

  async createPost(body: PostInputModelType): Promise<PostViewModelType> {
    const blog = await blogsCollection.findOne({ id: body.blogId })

    if (!blog) {
      throw new Error("Blog not found")
    }

    const newPost: PostViewModelType = {
      id: (Date.now() + Math.random()).toString(),
      title: body.title,
      shortDescription: body.shortDescription,
      content: body.content,
      blogId: body.blogId,
      blogName: blog?.name || "Unknown Blog",
      createdAt: new Date().toISOString(),
    }

    await postsCollection.insertOne(newPost)

    const post = await postsCollection.findOne({ id: newPost.id }, { projection: { _id: 0 } })

    return post as PostViewModelType
  },

  async getPostById(postId: string): Promise<PostViewModelType | null> {
    return await postsCollection.findOne({ id: postId }, { projection: { _id: 0 } })
  },

  async updatePost(postId: string, body: PostInputModelType): Promise<boolean> {
    const blog = await blogsCollection.findOne({ id: body.blogId })

    if (!blog) {
      throw new Error("Blog not found")
    }

    const result = await postsCollection.updateOne(
      { id: postId },
      {
        $set: {
          title: body.title,
          shortDescription: body.shortDescription,
          content: body.content,
          blogId: body.blogId,
          blogName: blog?.name || "Unknown Blog",
        },
      },
    )

    return result.matchedCount > 0
  },

  async deletePost(postId: string): Promise<boolean> {
    const result = await postsCollection.deleteOne({ id: postId })
    return result.deletedCount > 0
  },
}
