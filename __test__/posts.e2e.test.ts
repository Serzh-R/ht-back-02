import { SETTINGS } from "../src/settings"
import { connectTestDb, disconnectTestDb } from "../src/db/testMongoDb"
import { req } from "./test-helpers"
import { Collection } from "mongodb"
import { PostViewModelType } from "../src/types/types"

let testDb
let postsCollection: Collection<PostViewModelType>

beforeAll(async () => {
  testDb = await connectTestDb() // Подключаем временную базу данных
  postsCollection = testDb.collection("posts") // Инициализируем коллекцию
  if (!postsCollection) {
    throw new Error("Failed to initialize postsCollection")
  }
  console.log("postsCollection initialized:", !!postsCollection)
})

beforeEach(async () => {
  console.log("Clearing postsCollection...")
  await postsCollection.deleteMany({}) // Очищаем коллекцию перед каждым тестом
})

afterAll(async () => {
  await disconnectTestDb() // Останавливаем временную базу данных
})

describe("/posts", () => {
  const authHeader = { Authorization: "Basic " + Buffer.from("admin:qwerty").toString("base64") }

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

    expect(res.body.length).toBe(1)
    expect(res.body[0]).toMatchObject(initialData[0])
  })

  it("should create a new post", async () => {
    const newPost = {
      title: "New Post",
      shortDescription: "A short description for the new post",
      content: "The content of the new post",
      blogId: "1",
    }

    const res = await req.post(SETTINGS.PATH.POSTS).set(authHeader).send(newPost).expect(201)

    expect(res.body).toMatchObject({
      ...newPost,
      blogName: expect.any(String),
      createdAt: expect.any(String),
    })
    expect(res.body.id).toBeDefined()

    const postInDb = await postsCollection.findOne({ id: res.body.id })
    expect(postInDb).toMatchObject({
      ...newPost,
      blogName: "Tech Blog",
      createdAt: expect.any(String),
    })
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

    const res = await req.get(`${SETTINGS.PATH.POSTS}/1`).expect(200)

    expect(res.body).toMatchObject(initialData[0])
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
