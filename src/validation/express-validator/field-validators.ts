import { body, param } from "express-validator"
import { blogsRepository } from "../../blogs/blogs-repository"

export const idParamValidator = param("id")
  .isString()
  .withMessage("name should be a string")
  .trim()
  .notEmpty()
  .withMessage("name is required")

export const blogIdValidator = body("blogId")
  .isString()
  .withMessage("no string")
  .trim()
  .custom((blogId) => {
    const blog = blogsRepository.getBlogById(blogId)
    return !!blog
  })
  .withMessage("no blog")

const BlogFields: string = "name" | "description" | "websiteUrl"

export const specificFieldsValidator = (BlogFields) => {
  return body().custom((_, { req }) => {
    const bodyKeys = Object.keys(req.body) // Получаем все ключи из тела запроса
    const invalidFields = bodyKeys.filter((key) => !BlogFields.includes(key))

    if (invalidFields.length > 0) {
      throw new Error(`Invalid fields: ${invalidFields.join(", ")}`)
    }

    allowedFields.forEach((field) => {
      if (!req.body.hasOwnProperty(field)) {
        throw new Error(`Missing required field: ${field}`)
      }
    })

    return true // Все проверки прошли
  })
}

export const blogFieldsValidator = [
  specificFieldsValidator(BlogFields),
  body("name")
    .isString()
    .withMessage("name should be a string")
    .trim()
    .notEmpty()
    .withMessage("name is required")
    .isLength({ min: 1, max: 15 })
    .withMessage("name should contain 1 - 15 symbols"),
  body("description")
    .isString()
    .withMessage("description should be a string")
    .trim()
    .notEmpty()
    .withMessage("description is required")
    .isLength({ min: 1, max: 300 })
    .withMessage("description should contain 1 - 300 symbols"),
  body("websiteUrl")
    .isURL()
    .withMessage("websiteUrl should be a valid URL")
    .trim()
    .notEmpty()
    .withMessage("websiteUrl is required"),
]

/*export const blogNameValidator = body("name")
  .isString()
  .withMessage("name should be a string")
  .trim()
  .notEmpty()
  .withMessage("name is required")
  .isLength({ min: 1, max: 15 })
  .withMessage("name should contain 1 - 15 symbols")*/

/*export const blogDescriptionValidator = body("description")
  .isString()
  .withMessage("description should be a string")
  .trim()
  .notEmpty()
  .withMessage("description is required")
  .isLength({ min: 10, max: 500 })
  .withMessage("description should contain 10 - 500 symbols")*/

/*export const blogWebsiteUrlValidator = body("websiteUrl")
  .isString()
  .withMessage("websiteUrl should be a string")
  .trim()
  .notEmpty()
  .withMessage("websiteUrl is required")
  .isLength({ max: 100 })
  .withMessage("websiteUrl should not exceed 100 symbols")
  .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z]{2,}\/?([a-zA-Z0-9._-]+\/?)*$/)
  .withMessage("websiteUrl must be a valid URL starting with https://")*/

export const postTitleValidator = body("title")
  .isString()
  .withMessage("title should be a string")
  .trim()
  .notEmpty()
  .withMessage("title is required")
  .isLength({ min: 1, max: 30 })
  .withMessage("title should contain 1 - 30 symbols")

export const postShortDescriptionValidator = body("shortDescription")
  .isString()
  .withMessage("shortDescription should be a string")
  .trim()
  .notEmpty()
  .withMessage("shortDescription is required")
  .isLength({ min: 10, max: 100 })
  .withMessage("shortDescription should contain 10 - 100 symbols")

export const postContentValidator = body("content")
  .isString()
  .withMessage("content should be a string")
  .trim()
  .notEmpty()
  .withMessage("content is required")
  .isLength({ min: 10, max: 1000 })
  .withMessage("content should contain 10 - 1000 symbols")

export const nwArray = [
  idParamValidator,
  blogIdValidator,
  blogNameValidator,
  blogDescriptionValidator,
  blogWebsiteUrlValidator,
  postTitleValidator,
  postShortDescriptionValidator,
  postContentValidator,
]
