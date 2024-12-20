import { req } from "./test-helpers"
import { setDB } from "../src/db/db"
import { SETTINGS } from "../src/settings"

describe("/posts", () => {
  beforeEach(() => {
    setDB() // Очистка базы данных перед каждым тестом
  })

  it("should return an empty array when no posts exist", async () => {
    const res = await req.get(SETTINGS.PATH.POSTS).expect(200)

    console.log(res.body)
    expect(res.body).toEqual([])
  })

  it("should return posts when data exists", async () => {
    const initialData = {
      posts: [
        {
          id: "1",
          title: "Post Title",
          shortDescription: "A short description",
          content: "Post content",
          blogId: "1",
          blogName: "Tech Blog",
        },
      ],
    }
    setDB(initialData)

    const res = await req.get(SETTINGS.PATH.POSTS).expect(200)

    console.log(res.body)
    expect(res.body.length).toBe(1)
    expect(res.body[0]).toEqual(initialData.posts[0])
  })

  it("should create a new post", async () => {
    const newPost = {
      title: "New Post",
      shortDescription: "A short description for the new post",
      content: "The content of the new post",
      blogId: "1",
    }

    const res = await req.post(SETTINGS.PATH.POSTS).send(newPost).expect(201)

    console.log(res.body)
    expect(res.body).toMatchObject({
      ...newPost,
      blogName: expect.any(String),
    })
    expect(res.body.id).toBeDefined()
  })

  it("should return a post by ID", async () => {
    const initialData = {
      posts: [
        {
          id: "1",
          title: "Post Title",
          shortDescription: "A short description",
          content: "Post content",
          blogId: "1",
          blogName: "Tech Blog",
        },
      ],
    }
    setDB(initialData)

    const res = await req.get(`${SETTINGS.PATH.POSTS}/1`).expect(200)

    console.log(res.body)
    expect(res.body).toEqual(initialData.posts[0])
  })

  it("should update a post", async () => {
    const initialData = {
      posts: [
        {
          id: "1",
          title: "Post Title",
          shortDescription: "A short description",
          content: "Post content",
          blogId: "1",
          blogName: "Tech Blog",
        },
      ],
    }
    setDB(initialData)

    const updatedPost = {
      title: "Updated Post Title",
      shortDescription: "Updated short description",
      content: "Updated post content",
      blogId: "1",
    }

    await req.put(`${SETTINGS.PATH.POSTS}/1`).send(updatedPost).expect(204)

    const res = await req.get(`${SETTINGS.PATH.POSTS}/1`).expect(200)

    console.log(res.body)
    expect(res.body).toMatchObject({
      ...updatedPost,
      blogName: expect.any(String),
    })
  })

  it("should delete a post", async () => {
    const initialData = {
      posts: [
        {
          id: "1",
          title: "Post Title",
          shortDescription: "A short description",
          content: "Post content",
          blogId: "1",
          blogName: "Tech Blog",
        },
      ],
    }
    setDB(initialData)

    await req.delete(`${SETTINGS.PATH.POSTS}/1`).expect(204)

    const res = await req.get(SETTINGS.PATH.POSTS).expect(200)

    console.log(res.body)
    expect(res.body).toEqual([])
  })
})
