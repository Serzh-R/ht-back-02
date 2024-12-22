import { SETTINGS } from "../src/settings"
import { connectTestDb, disconnectTestDb } from "../src/db/testMongoDb"
import { req } from "./test-helpers"
import { Collection } from "mongodb"
import { BlogViewModelType } from "../src/types/types"

let testDb
let blogsCollection: Collection<BlogViewModelType> // Локальная коллекция для тестов

beforeAll(async () => {
  testDb = await connectTestDb() // Подключение к MongoMemoryServer
  blogsCollection = testDb.collection("blogs") // Подключаем временную коллекцию
  console.log("blogsCollection initialized:", !!blogsCollection)
})

afterAll(async () => {
  await disconnectTestDb() // Остановка MongoMemoryServer
})

describe("/blogs", () => {
  const authHeader = {
    Authorization: "Basic " + Buffer.from("admin:qwerty").toString("base64"),
  }

  beforeEach(async () => {
    if (!blogsCollection) {
      throw new Error("blogsCollection is not initialized")
    }
    await blogsCollection.deleteMany({})
  })

  it("should return an empty array when no blogs exist", async () => {
    const res = await req.get(SETTINGS.PATH.BLOGS).expect(200)
    expect(res.body).toEqual([])
  })

  it("should return blogs when data exists", async () => {
    const initialData = [
      {
        id: "1",
        name: "Tech Blog",
        description: "A blog about tech",
        websiteUrl: "https://techblog.com",
        createdAt: new Date().toISOString(),
        isMembership: false,
      },
    ]
    await blogsCollection.insertMany(initialData) // Добавление данных в коллекцию

    const res = await req.get(SETTINGS.PATH.BLOGS).expect(200)

    expect(res.body.length).toBe(1)
    expect(res.body[0]).toMatchObject(initialData[0])
  })

  it("should create a new blog", async () => {
    const newBlog = {
      name: "New Blog",
      description: "A new blog description",
      websiteUrl: "https://newblog.com",
    }

    const res = await req.post(SETTINGS.PATH.BLOGS).set(authHeader).send(newBlog).expect(201)

    expect(res.body).toMatchObject({
      ...newBlog,
      createdAt: expect.any(String),
      isMembership: false,
    })
    expect(res.body.id).toBeDefined()

    const blogInDb = await blogsCollection.findOne({ id: res.body.id })
    expect(blogInDb).toMatchObject({
      ...newBlog,
      createdAt: expect.any(String),
      isMembership: false,
    })
  })

  it("should return a blog by ID", async () => {
    const initialData = [
      {
        id: "1",
        name: "Tech Blog",
        description: "A blog about tech",
        websiteUrl: "https://techblog.com",
        createdAt: new Date().toISOString(),
        isMembership: false,
      },
    ]
    await blogsCollection.insertMany(initialData)

    const res = await req.get(`${SETTINGS.PATH.BLOGS}/1`).expect(200)

    expect(res.body).toMatchObject(initialData[0])
  })

  it("should update a blog", async () => {
    const initialData = [
      {
        id: "1",
        name: "Tech Blog",
        description: "A blog about tech",
        websiteUrl: "https://techblog.com",
        createdAt: new Date().toISOString(),
        isMembership: false,
      },
    ]
    await blogsCollection.insertMany(initialData)

    const updatedBlog = {
      name: "Updated Tech Blog",
      description: "An updated blog about tech",
      websiteUrl: "https://updatedtechblog.com",
    }

    await req.put(`${SETTINGS.PATH.BLOGS}/1`).set(authHeader).send(updatedBlog).expect(204)

    const res = await req.get(`${SETTINGS.PATH.BLOGS}/1`).expect(200)

    expect(res.body).toMatchObject(updatedBlog)

    const blogInDb = await blogsCollection.findOne({ id: "1" })
    expect(blogInDb).toMatchObject({
      ...updatedBlog,
      createdAt: expect.any(String),
      isMembership: false,
    })
  })

  it("should delete a blog", async () => {
    const initialData = [
      {
        id: "1",
        name: "Tech Blog",
        description: "A blog about tech",
        websiteUrl: "https://techblog.com",
        createdAt: new Date().toISOString(),
        isMembership: false,
      },
    ]
    await blogsCollection.insertMany(initialData)

    await req.delete(`${SETTINGS.PATH.BLOGS}/1`).set(authHeader).expect(204)

    const res = await req.get(SETTINGS.PATH.BLOGS).expect(200)

    expect(res.body).toEqual([])
  })
})
