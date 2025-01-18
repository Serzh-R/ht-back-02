import { body, param } from 'express-validator'
import { blogsCollection } from '../../db/mongoDb'
import { ObjectId } from 'mongodb'

export const idParamValidator = param('id')
  .isString()
  .withMessage('name should be a string')
  .trim()
  .notEmpty()
  .withMessage('name is required')

export const postIdValidator = param('postId')
  .isString()
  .trim()
  .notEmpty()
  .custom((value) => ObjectId.isValid(value))
  .withMessage('Invalid postId')

export const blogIdValidator = body('blogId')
  .isString()
  .withMessage('blogId should be a string')
  .trim()
  .notEmpty()
  .custom(async (blogId) => {
    if (!ObjectId.isValid(blogId)) {
      throw new Error('Invalid blogId format')
    }

    const blog = await blogsCollection.findOne({ _id: new ObjectId(blogId) })
    if (!blog) {
      throw new Error('No blog found with the provided blogId')
    }

    return true
  })

/*************************************************************************************/

const BlogFields: string[] = ['name', 'description', 'websiteUrl']

export const specificFieldsValidator = (fields: string[]) => {
  return body().custom((_, { req }) => {
    const bodyKeys = Object.keys(req.body)

    const invalidFields = bodyKeys.filter((key) => !fields.includes(key))
    if (invalidFields.length > 0) {
    }
    return true
  })
}

export const blogFieldsValidator = [
  specificFieldsValidator(BlogFields),
  body('name')
    // .optional()
    .isString()
    .withMessage('name should be a string')
    .trim()
    .notEmpty()
    .withMessage('name is required')
    .isLength({ max: 15 })
    .withMessage('the name length should not exceed 15 characters'),
  body('description')
    //.optional()
    .isString()
    .withMessage('description should be a string')
    .trim()
    .notEmpty()
    .withMessage('description is required')
    .isLength({ max: 500 })
    .withMessage('the description length should not exceed 500 characters'),
  body('websiteUrl')
    //.optional()
    .isURL()
    .withMessage('websiteUrl should be a valid URL')
    .isString()
    .withMessage('websiteUrl should be a string')
    .trim()
    .notEmpty()
    .withMessage('websiteUrl is required')
    .isLength({ max: 100 })
    .withMessage('websiteUrl should not exceed 100 symbols')
    .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z]{2,}\/?([a-zA-Z0-9._-]+\/?)*$/)
    .withMessage('websiteUrl must be a valid URL starting with https://'),
]

/*****************************************************************************************************/

export const commentContentValidator = body('content')
  .isString()
  .trim()
  .isLength({ min: 20, max: 300 })
  .withMessage('Content must be between 20 and 300 characters')

/********************************************************************************************************/

export const postTitleValidator = body('title')
  .isString()
  .withMessage('title should be a string')
  .trim()
  .notEmpty()
  .withMessage('title is required')
  .isLength({ max: 30 })
  .withMessage('title should contain 30 symbols')

export const postShortDescriptionValidator = body('shortDescription')
  .isString()
  .withMessage('shortDescription should be a string')
  .trim()
  .notEmpty()
  .withMessage('shortDescription is required')
  .isLength({ max: 100 })
  .withMessage('shortDescription should contain 100 symbols')

export const postContentValidator = body('content')
  .isString()
  .withMessage('content should be a string')
  .trim()
  .notEmpty()
  .withMessage('content is required')
  .isLength({ max: 1000 })
  .withMessage('content should contain 1000 symbols')

export const nwArray = [
  idParamValidator,
  blogIdValidator,
  blogFieldsValidator,
  postTitleValidator,
  postShortDescriptionValidator,
  postContentValidator,
]
