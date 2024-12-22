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

/*************************************************************************************/

const BlogFields: string[] = ["name", "description", "websiteUrl"]

export const specificFieldsValidator = (fields: string[]) => {
  return body().custom((_, { req }) => {
    const bodyKeys = Object.keys(req.body) // Получаем все ключи из тела запроса

    const invalidFields = bodyKeys.filter((key) => !fields.includes(key))
    if (invalidFields.length > 0) {
    }
    return true
  })
}

export const blogFieldsValidator = [
  specificFieldsValidator(BlogFields),
  body("name")
    //.optional()
    .isString()
    .withMessage("name should be a string")
    .trim()
    .notEmpty()
    .withMessage("name is required")
    .isLength({ max: 15 })
    .withMessage("the name length should not exceed 15 characters"),
  body("description")
    //.optional()
    .isString()
    .withMessage("description should be a string")
    .trim()
    .notEmpty()
    .withMessage("description is required")
    .isLength({ max: 500 })
    .withMessage("the description length should not exceed 500 characters"),
  body("websiteUrl")
    //.optional()
    .isURL()
    .withMessage("websiteUrl should be a valid URL")
    .isString()
    .withMessage("websiteUrl should be a string")
    .trim()
    .notEmpty()
    .withMessage("websiteUrl is required")
    .isLength({ max: 100 })
    .withMessage("websiteUrl should not exceed 100 symbols")
    .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z]{2,}\/?([a-zA-Z0-9._-]+\/?)*$/)
    .withMessage("websiteUrl must be a valid URL starting with https://"),
  /*body("createdAt")
    .isString()
    .withMessage("createdAt should be a string")
    .isISO8601()
    .withMessage("createdAt should be a valid ISO8601 date"),
  body("isMembership").isBoolean().withMessage("isMembership should be a boolean"),*/

  // Проверяем, что в body нет лишних полей
  //checkExact([], { message: "Invalid fields in request body" }),
]

/*****************************************************************************************************/

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

/********************************************************************************************************/

export const postTitleValidator = body("title")
  .isString()
  .withMessage("title should be a string")
  .trim()
  .notEmpty()
  .withMessage("title is required")
  .isLength({ max: 30 })
  .withMessage("title should contain 30 symbols")

export const postShortDescriptionValidator = body("shortDescription")
  .isString()
  .withMessage("shortDescription should be a string")
  .trim()
  .notEmpty()
  .withMessage("shortDescription is required")
  .isLength({ max: 100 })
  .withMessage("shortDescription should contain 100 symbols")

export const postContentValidator = body("content")
  .isString()
  .withMessage("content should be a string")
  .trim()
  .notEmpty()
  .withMessage("content is required")
  .isLength({ max: 1000 })
  .withMessage("content should contain 1000 symbols")

/*export const postCreatedAtValidator = body("createdAt")
  .isString()
  .withMessage("createdAt should be a string")
  .isISO8601()
  .withMessage("createdAt should be a valid ISO8601 date")*/

export const nwArray = [
  idParamValidator,
  blogIdValidator,
  blogFieldsValidator,
  postTitleValidator,
  postShortDescriptionValidator,
  postContentValidator,
  //postCreatedAtValidator,
]
