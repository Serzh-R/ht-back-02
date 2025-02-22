import { body } from 'express-validator'
import { usersRepository } from '../UsersRepository'

export const emailValidation = body('email')
  .isString()
  .trim()
  .isLength({ min: 1 })
  .withMessage('email is required')
  .isEmail()
  .withMessage('email is not correct')
  .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  .withMessage('email format is invalid')
  .custom(async (email: string) => {
    const user = await usersRepository.findByLoginOrEmail(email)
    if (user) {
      throw new Error('email already exists')
    }
    return true
  })

export const isUserConfirmedByEmailValidation = body('email')
  .isString()
  .trim()
  .isLength({ min: 1 })
  .withMessage('email is required')
  .isEmail()
  .withMessage('email is not correct')
  .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  .withMessage('email format is invalid')
  .custom(async (email: string) => {
    const user = await usersRepository.findByLoginOrEmail(email)
    if (!user || user.emailConfirmation.isConfirmed) {
      throw new Error("user doesn't exist or already confirmed")
    }
    return true
  })

export const loginOrEmailValidation = body('loginOrEmail')
  .isString()
  .trim()
  .isLength({ min: 1, max: 500 })
  .withMessage('loginOrEmail is not correct')

export const loginValidation = body('login')
  .isString()
  .trim()
  .isLength({ min: 3, max: 10 })
  .withMessage('login must be between 3 and 10 characters')
  .matches(/^[a-zA-Z0-9_-]*$/)
  .withMessage('login contains invalid characters')
  .custom(async (login: string) => {
    const user = await usersRepository.findByLoginOrEmail(login)
    if (user) {
      throw new Error('login already exists')
    }
    return true
  })

export const passwordValidation = body('password')
  .isString()
  .trim()
  .isLength({ min: 6, max: 20 })
  .withMessage('password must be between 6 and 20 characters')
  .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,20}$/)
  .withMessage('password must contain at least one letter, one number, and be 6-20 characters long')

export const userInputValidators = [loginValidation, passwordValidation, emailValidation]
