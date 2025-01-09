import { config } from "dotenv"
config() // добавление переменных из файла .env в process.env

export const SETTINGS = {
  // все хардкодные значения должны быть здесь, для удобства их изменения
  PORT: process.env.PORT || 3003,
  ADMIN: {
    LOGIN: "admin",
    PASSWORD: "qwerty",
  },
  PATH: {
    BLOGS: "/blogs",
    POSTS: "/posts",
    DELETE_ALL: "/testing/all-data",
  },
  MONGO_URL: process.env.MONGO_URL || "mongodb://localhost:27017",
  DB_NAME: process.env.DB_NAME || "test",
}

export const HTTP_STATUSES = {
  OK_200: 200,
  CREATED_201: 201,
  NO_CONTENT_204: 204,

  BAD_REQUEST_400: 400,
  NOT_FOUND_404: 404,

  INTERNAL_SERVER_ERROR_500: 500,
}
