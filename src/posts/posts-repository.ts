import { db } from "../db/db"
import { PostInputModelType, PostViewModelType } from "../types/types"

export const postsRepository = {
  getPosts() {
    return db.posts
  },

  createPost(body: PostInputModelType) {
    const newPost: PostViewModelType = {
      id: (Date.now() + Math.random()).toString(),
      title: body.title,
      shortDescription: body.shortDescription,
      content: body.content,
      blogId: body.blogId,
      blogName: db.blogs.find((blog) => blog.id === body.blogId)?.name || "Unknown Blog",
    }

    db.posts = [...db.posts, newPost]
    return newPost
  },

  getPostById(postId: string): PostViewModelType | undefined {
    return db.posts.find((post) => post.id === postId)
  },

  updatePost(postId: string, body: PostInputModelType) {
    const postIndex = db.posts.findIndex((post) => post.id === postId)

    if (postIndex === -1) {
      return false
    }

    db.posts[postIndex] = {
      ...db.posts[postIndex],
      title: body.title,
      shortDescription: body.shortDescription,
      content: body.content,
      blogId: body.blogId,
      blogName: db.blogs.find((blog) => blog.id === body.blogId)?.name || db.posts[postIndex].blogName,
    }

    return true
  },

  deletePost(postId: string) {
    const post: PostViewModelType | undefined = db.posts.find((p) => p.id === postId)

    if (!post) {
      return false
    }

    db.posts = db.posts.filter((post) => post.id !== postId)
    return true

    /*const postIndex = db.posts.findIndex((post) => post.id === postId)

    if (postIndex === -1) {
      return false
    }*/

    /*db.posts.splice(postIndex, 1)
    return true*/
  },
}
