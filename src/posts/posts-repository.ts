import { db } from "../db/db"
import { PostInputModelType, PostViewModelType } from "../types/types"
import { blogsCollection, postsCollection } from "../db/mongoDb"

export const postsRepository = {
  async getPosts(): Promise<PostViewModelType[]> {
    return await postsCollection.find().toArray() // Получение всех постов
  },

  async createPost(body: PostInputModelType): Promise<PostViewModelType> {
    const blog = await blogsCollection.findOne({ id: body.blogId })
    const newPost: PostViewModelType = {
      id: (Date.now() + Math.random()).toString(),
      title: body.title,
      shortDescription: body.shortDescription,
      content: body.content,
      blogId: body.blogId,
      blogName: blog?.name || "Unknown Blog", // Проверка существования блога
    }

    await postsCollection.insertOne(newPost) // Добавление поста в коллекцию
    return newPost
  },

  async getPostById(postId: string): Promise<PostViewModelType | null> {
    return await postsCollection.findOne({ id: postId }) // Поиск поста по ID
  },

  async updatePost(postId: string, body: PostInputModelType): Promise<boolean> {
    const blog = await blogsCollection.findOne({ id: body.blogId })
    const result = await postsCollection.updateOne(
      { id: postId },
      {
        $set: {
          title: body.title,
          shortDescription: body.shortDescription,
          content: body.content,
          blogId: body.blogId,
          blogName: blog?.name || "Unknown Blog", // Проверка существования блога
        },
      },
    )

    return result.matchedCount > 0 // Возвращает true, если обновление успешно
  },

  async deletePost(postId: string): Promise<boolean> {
    const result = await postsCollection.deleteOne({ id: postId })
    return result.deletedCount > 0 // Возвращает true, если удаление успешно
  },
}
