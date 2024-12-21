import { req } from "./test-helpers"
import { setDB } from "../src/db/db"
import { SETTINGS } from "../src/settings"

describe("/blogs", () => {
  const authHeader = { Authorization: "Basic " + Buffer.from("admin:qwerty").toString("base64") }

  beforeEach(() => {
    setDB() // Очистка базы данных перед каждым тестом
    console.log("DB State:", JSON.stringify(setDB)) // Логируем состояние базы
  })

  it("should return an empty array when no blogs exist", async () => {
    const res = await req.get(SETTINGS.PATH.BLOGS).expect(200)

    console.log(res.body)
    expect(res.body).toEqual([])
  })

  it("should return blogs when data exists", async () => {
    const initialData = {
      blogs: [
        {
          id: "1",
          name: "Tech Blog",
          description: "A blog about tech",
          websiteUrl: "https://techblog.com",
        },
      ],
    }
    setDB(initialData)

    const res = await req.get(SETTINGS.PATH.BLOGS).expect(200)

    console.log(res.body)
    expect(res.body.length).toBe(1)
    expect(res.body[0]).toEqual(initialData.blogs[0])
  })

  it("should create a new blog", async () => {
    const newBlog = {
      name: "New Blog",
      description: "A new blog description",
      websiteUrl: "https://newblog.com",
    }

    const res = await req.post(SETTINGS.PATH.BLOGS).set(authHeader).send(newBlog).expect(201)

    console.log(res.body)
    expect(res.body).toMatchObject(newBlog)
    expect(res.body.id).toBeDefined()
  })

  it("should return a blog by ID", async () => {
    const initialData = {
      blogs: [
        {
          id: "1",
          name: "Tech Blog",
          description: "A blog about tech",
          websiteUrl: "https://techblog.com",
        },
      ],
    }
    setDB(initialData)

    const res = await req.get(`${SETTINGS.PATH.BLOGS}/1`).expect(200)

    console.log(res.body)
    expect(res.body).toEqual(initialData.blogs[0])
  })

  it("should update a blog", async () => {
    const initialData = {
      blogs: [
        {
          id: "1",
          name: "Tech Blog",
          description: "A blog about tech",
          websiteUrl: "https://techblog.com",
        },
      ],
    }
    setDB(initialData)

    const updatedBlog = {
      name: "Updated Tech Blog",
      description: "An updated blog about tech",
      websiteUrl: "https://updatedtechblog.com",
    }

    await req.put(`${SETTINGS.PATH.BLOGS}/1`).set(authHeader).send(updatedBlog).expect(204)

    const res = await req.get(`${SETTINGS.PATH.BLOGS}/1`).expect(200)

    console.log(res.body)
    expect(res.body).toMatchObject(updatedBlog)
  })

  it("should delete a blog", async () => {
    const initialData = {
      blogs: [
        {
          id: "1",
          name: "Tech Blog",
          description: "A blog about tech",
          websiteUrl: "https://techblog.com",
        },
      ],
    }
    setDB(initialData)

    await req.delete(`${SETTINGS.PATH.BLOGS}/1`).set(authHeader).expect(204)

    const res = await req.get(SETTINGS.PATH.BLOGS).expect(200)

    console.log(res.body)
    expect(res.body).toEqual([])
  })
})
