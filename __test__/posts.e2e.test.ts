import { SETTINGS } from "../src/settings"
import { connectTestDb, disconnectTestDb } from "../src/db/testMongoDb"
import { req } from "./test-helpers"
import { postsCollection } from "../src/db/mongoDb"

beforeAll(async () => {
  await connectTestDb() // Подключаем временную базу данных
})

beforeEach(async () => {
  console.log("Clearing postsCollection...")
  await postsCollection.deleteMany({}) // Очищаем коллекцию перед каждым тестом
})

afterAll(async () => {
  await disconnectTestDb() // Останавливаем временную базу данных
})

describe("/posts", () => {
  const authHeader = {
    Authorization: "Basic " + Buffer.from("admin:qwerty").toString("base64"),
  }

  it("should return an empty array when no posts exist", async () => {
    const res = await req.get(SETTINGS.PATH.POSTS).expect(200)
    expect(res.body).toEqual([])
  })

  it("should return posts when data exists", async () => {
    const initialData = [
      {
        id: "1",
        title: "Post Title",
        shortDescription: "A short description",
        content: "Post content",
        blogId: "1",
        blogName: "Tech Blog",
        createdAt: new Date().toISOString(),
      },
    ]
    await postsCollection.insertMany(initialData) // Добавление данных в коллекцию

    const res = await req.get(SETTINGS.PATH.POSTS).expect(200)

    const post = await postsCollection.findOne(
      { id: "1" },
      { projection: { _id: 0 } },
    )

    if (!post) {
      throw new Error("Posts not found")
    }

    expect(res.body.length).toBe(1)
    expect(res.body[0]).toMatchObject(post)
  })

  it("should create a new post", async () => {
    const newBlog = {
      name: "New Blog",
      description: "A new blog description",
      websiteUrl: "https://newblog.com",
    }

    const blogCreationRes = await req
      .post(SETTINGS.PATH.BLOGS)
      .set(authHeader)
      .send(newBlog)

    console.log("New blog response:", blogCreationRes.body)

    const blogId = blogCreationRes.body.id

    const newPost = {
      title: "New Post",
      shortDescription: "A short description for the new post",
      content: "The content of the new post",
      blogId: blogId,
    }

    const res = await req
      .post(SETTINGS.PATH.POSTS)
      .set(authHeader)
      .send(newPost)

    console.log("Response status:", res.status)
    console.log("Response body:", res.body)

    expect(res.status).toBe(201)

    expect(res.body).toMatchObject({
      ...newPost,
      blogName: expect.any(String),
      createdAt: expect.any(String),
    })

    expect(res.body.id).toBeDefined()
  })

  it("should return a post by ID", async () => {
    const initialData = [
      {
        id: "1",
        title: "Post Title",
        shortDescription: "A short description",
        content: "Post content",
        blogId: "1",
        blogName: "Tech Blog",
        createdAt: new Date().toISOString(),
      },
    ]
    await postsCollection.insertMany(initialData)

    const postById = await postsCollection.findOne(
      { id: "1" },
      { projection: { _id: 0 } },
    )

    if (!postById) {
      throw new Error("Posts not found")
    }

    const res = await req.get(`${SETTINGS.PATH.POSTS}/1`).expect(200)

    expect(res.body).toMatchObject(postById)
  })

  it("should delete a post", async () => {
    const initialData = [
      {
        id: "1",
        title: "Post Title",
        shortDescription: "A short description",
        content: "Post content",
        blogId: "1",
        blogName: "Tech Blog",
        createdAt: new Date().toISOString(),
      },
    ]
    await postsCollection.insertMany(initialData)

    await req.delete(`${SETTINGS.PATH.POSTS}/1`).set(authHeader).expect(204)

    const res = await req.get(SETTINGS.PATH.POSTS).expect(200)
    expect(res.body).toEqual([])
  })
})
