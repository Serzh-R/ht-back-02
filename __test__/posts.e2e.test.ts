import { req } from "./test-helpers"
import { SETTINGS } from "../src/settings"
import { setDB } from "../src/db/mongoDb"

describe("/posts", () => {
  const authHeader = { Authorization: "Basic " + Buffer.from("admin:qwerty").toString("base64") }

  beforeEach(async () => {
    await setDB()
  })

  it("should return an empty array when no posts exist", async () => {
    const res = await req.get(SETTINGS.PATH.POSTS).expect(200)
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
          createdAt: new Date().toISOString(),
        },
      ],
    }
    await setDB(initialData)

    const res = await req.get(SETTINGS.PATH.POSTS).expect(200)
    expect(res.body.length).toBe(1)
    expect(res.body[0]).toEqual(initialData.posts[0])
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
          createdAt: new Date().toISOString(),
        },
      ],
    }
    await setDB(initialData)

    const res = await req.get(`${SETTINGS.PATH.POSTS}/1`).expect(200)
    expect(res.body).toEqual(initialData.posts[0])
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
          createdAt: new Date().toISOString(),
        },
      ],
    }
    await setDB(initialData)

    await req.delete(`${SETTINGS.PATH.POSTS}/1`).set(authHeader).expect(204)

    const res = await req.get(SETTINGS.PATH.POSTS).expect(200)
    expect(res.body).toEqual([])
  })
})
