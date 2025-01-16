import { config } from 'dotenv'
config() // добавление переменных из файла .env в process.env

export const SETTINGS = {
  // все хардкодные значения должны быть здесь, для удобства их изменения
  PORT: process.env.PORT || 3003,
  ADMIN: {
    LOGIN: 'admin',
    PASSWORD: 'qwerty',
  },
  PATH: {
    BLOGS: '/blogs',
    POSTS: '/posts',
    AUTH: '/auth',
    USERS: '/users',
    COMMENTS: '/comments',
    DELETE_ALL: '/testing/all-data',
  },
  MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017',
  DB_NAME: process.env.DB_NAME || 'test',
}

export const HTTP_STATUSES = {
  OK_200: 200,
  CREATED_201: 201,
  NO_CONTENT_204: 204,

  BAD_REQUEST_400: 400,
  UNAUTHORIZED_401: 401,
  FORBIDDEN_403: 403,
  NOT_FOUND_404: 404,

  SERVER_ERROR_500: 500,
}

export const BCRYPT_SALT = 5

export const AC_TIME = process.env.JWT_TIME || '300'
export const AC_SECRET = process.env.JWT_SECRET || 'your_secret_key'
