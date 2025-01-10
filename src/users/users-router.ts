import { Router, Request, Response } from 'express'
import { paginationQueries } from '../helpers/paginations_values'
import { HTTP_STATUSES } from '../settings'
import { authMiddleware } from '../middlewares/auth-middleware'
import { usersQueryRepository } from './users-query-repository'
import { UserInputType } from '../types/types'
import { userInputValidators } from './middlewares/user-validators'
import { errorsResultMiddleware } from '../validation/express-validator/errors-result-middleware'

export const usersRouter = Router()

export const usersController = {
  async getUsers(req: Request, res: Response) {
    const {
      sortBy,
      sortDirection,
      pageNumber,
      pageSize,
      searchLoginTerm,
      searchEmailTerm,
    } = paginationQueries(req)

    const users = await usersQueryRepository.getUsers(
      sortBy,
      sortDirection,
      pageNumber,
      pageSize,
      searchLoginTerm,
      searchEmailTerm,
    )
    res.status(HTTP_STATUSES.OK_200).json(users)
  },

  async createUser(req: Request, res: Response) {
    const body: UserInputType = req.body

    const userId = await usersService.createUser(body)
    const newUser = await usersQueryRepository.findById(userId)

    return res.status(HTTP_STATUSES.CREATED_201).send(newUser!)
  },
}

usersRouter.get('/', authMiddleware, usersController.getUsers)
usersRouter.post(
  '/',
  authMiddleware,
  userInputValidators,
  errorsResultMiddleware,
  usersController.createUser,
)
