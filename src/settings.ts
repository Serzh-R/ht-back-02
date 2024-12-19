import { config } from "dotenv"
config() // добавление переменных из файла .env в process.env

export const SETTINGS = {
  // все хардкодные значения должны быть здесь, для удобства их изменения
  PORT: process.env.PORT || 3003,
  CREDENTIALS: {
    LOGIN: "admin",
    PASSWORD: "qwerty",
  },
  PATH: {
    BLOGS: "/blogs",
    POSTS: "/posts",
    DELETE_ALL: "/testing/all-data",
  },
}

export const HTTP_STATUSES = {
  OK_200: 200,
  CREATED_201: 201,
  NO_CONTENT_204: 204,

  BAD_REQUEST_400: 400,
  NOT_FOUND_404: 404,
}
