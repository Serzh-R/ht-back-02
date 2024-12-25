import { SETTINGS } from "../src/settings"
import { connectTestDb, disconnectTestDb } from "../src/db/testMongoDb"
import { req } from "./test-helpers"
import { blogsCollection } from "../src/db/mongoDb"

beforeAll(async () => {
  await connectTestDb()
})

beforeEach(async () => {
  console.log("Clearing blogsCollection...")
  await blogsCollection.deleteMany({})
})

afterAll(async () => {
  await disconnectTestDb()
})

describe("/blogs", () => {
  const authHeader = {
    Authorization: "Basic " + Buffer.from("admin:qwerty").toString("base64"),
  }

  it("should return an empty array when no blogs exist", async () => {
    const res = await req.get(SETTINGS.PATH.BLOGS).expect(200)
    expect(res.body).toEqual([])
  })

  it("should create a new blog", async () => {
    const newBlog = {
      name: "New Blog",
      description: "A new blog description",
      websiteUrl: "https://newblog.com",
    }

    const res = await req
      .post(SETTINGS.PATH.BLOGS)
      .set(authHeader)
      .send(newBlog)
      .expect(201)

    expect(res.body).toMatchObject({
      ...newBlog,
      createdAt: expect.any(String),
      isMembership: false,
    })
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

    await blogsCollection.insertMany(initialData) // Добавляем данные в базу

    const res = await req.get(SETTINGS.PATH.BLOGS).expect(200)

    const blogsInDb = await blogsCollection.findOne(
      { id: "1" },
      { projection: { _id: 0 } },
    )

    if (!blogsInDb) {
      throw new Error("Blog not found in the database")
    }

    expect(res.body.length).toBe(1)
    expect(res.body[0]).toMatchObject(blogsInDb)
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

    const blogById = await blogsCollection.findOne(
      { id: "1" },
      { projection: { _id: 0 } },
    )

    if (!blogById) {
      throw new Error("Blog not found in the database")
    }

    const res = await req.get(`${SETTINGS.PATH.BLOGS}/1`).expect(200)

    expect(res.body).toMatchObject(blogById)
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
      name: "Updated Blog",
      description: "An updated blog about tech",
      websiteUrl: "https://updatedtechblog.com",
    }

    const blogsBeforeUpdate = await blogsCollection.find().toArray()
    console.log("Blogs before update:", blogsBeforeUpdate)

    console.log("Request body:", updatedBlog)
    await req
      .put(`${SETTINGS.PATH.BLOGS}/1`)
      .set(authHeader)
      .send(updatedBlog)
      .expect(204)

    // ******************** Пример как выявить ошибку *************** //
    /*console.log("Request body:", updatedBlog)
    const result = await req    // создаем переменную
      .put(`${SETTINGS.PATH.BLOGS}/1`)
      .set(authHeader)
      .send(updatedBlog)*/
    //.expect(204)  //   комментим вывод ошибки

    /*console.log(result.body)*/ // выводим пояснение ошибки в консоль
    // *********************************************************** //

    const res = await req.get(`${SETTINGS.PATH.BLOGS}/1`).expect(200)
    console.log("Response body:", res.body)

    expect(res.body).toMatchObject(updatedBlog)
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
