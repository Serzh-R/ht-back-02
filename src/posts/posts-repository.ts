import { PostInputType, PostType } from "../types/types"
import { blogsCollection, postsCollection } from "../db/mongoDb"

export const postsRepository = {
  async getPosts(
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: "asc" | "desc",
  ): Promise<PostType[]> {
    return await postsCollection
      .find({}, { projection: { _id: 0 } })
      .sort({ [sortBy]: sortDirection === "asc" ? 1 : -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray()
  },
  async getPostsCount(): Promise<number> {
    return await postsCollection.countDocuments()
  },

  async createPost(newPost: PostType): Promise<PostType> {
    await postsCollection.insertOne(newPost)
    return newPost
  },

  async getPostById(id: string): Promise<PostType | null> {
    return await postsCollection.findOne({ id }, { projection: { _id: 0 } })
  },

  async updatePost(id: string, body: PostInputType): Promise<boolean> {
    const blog = await blogsCollection.findOne({ id: body.blogId })

    if (!blog) {
      throw new Error("Blog not found")
    }

    const result = await postsCollection.updateOne(
      { id },
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

//////////////////////////////////////////////////////////////////

/* async createPost(body: PostInputType): Promise<PostType> {
    const blog = await blogsCollection.findOne({ id: body.blogId })

    if (!blog) {
      throw new Error("Blog not found")
    }

    const newPost: PostType = {
      id: (Date.now() + Math.random()).toString(),
      title: body.title,
      shortDescription: body.shortDescription,
      content: body.content,
      blogId: body.blogId,
      blogName: blog?.name || "Unknown Blog",
      createdAt: new Date().toISOString(),
    }

    await postsCollection.insertOne(newPost)

    const post = await postsCollection.findOne(
      { id: newPost.id },
      { projection: { _id: 0 } },
    )

    return post as PostType
  },*/

/*async getPostById(postId: string): Promise<PostType | null> {
  return await postsCollection.findOne(
    { id: postId },
    { projection: { _id: 0 } },
  )
},*/

/*async updatePost(postId: string, body: PostInputType): Promise<boolean> {
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
},*/

/*async deletePost(postId: string): Promise<boolean> {
  const result = await postsCollection.deleteOne({ id: postId })
  return result.deletedCount > 0
},*/
