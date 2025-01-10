import { Router, Request, Response } from 'express'
import { paginationQueries } from '../helpers/paginations_values'
import { HTTP_STATUSES } from '../settings'
import { authMiddleware } from '../middlewares/auth-middleware'

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

    const users = await usersRepository.getUsers(
      sortBy,
      sortDirection,
      pageNumber,
      pageSize,
      searchLoginTerm,
      searchEmailTerm,
    )
    res.status(HTTP_STATUSES.OK_200).json(users)
  },
}

usersRouter.get('/', authMiddleware, usersController.getUsers)
