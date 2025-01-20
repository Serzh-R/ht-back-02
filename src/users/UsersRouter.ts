import { Router, Request, Response } from 'express'
import { paginationQueries } from '../helpers/paginations.values'
import { HTTP_STATUSES } from '../settings'
import { usersQueryRepository } from './UsersQueryRepository'
import { userInputValidators } from './middlewares/user.validators'
import { errorsResultMiddleware } from '../validation/express-validator/errors.result.middleware'
import { usersService } from './UsersService'
import { idParamValidator } from '../validation/express-validator/field.validators'
import { authMiddleware } from '../middlewares/auth.middleware'
import { UserInputType } from '../auth/types/types'
import { ResultStatus } from '../common/result/resultCode'

export const usersRouter = Router()

export const usersController = {
  async getUsers(req: Request, res: Response) {
    const { sortBy, sortDirection, pageNumber, pageSize, searchLoginTerm, searchEmailTerm } =
      paginationQueries(req)

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

    const result = await usersService.createUser(body)

    if (result.status !== ResultStatus.Success || !result.data) {
      res.status(HTTP_STATUSES.BAD_REQUEST_400).json({ errorsMessages: result.extensions })
      return
    }

    const userId = result.data.userId

    const newUser = await usersQueryRepository.findUserById(userId)

    res.status(HTTP_STATUSES.CREATED_201).send(newUser)
  },

  async deleteUser(req: Request, res: Response) {
    const id = req.params.id
    const user = await usersService.deleteUser(id)
    if (!user) {
      res.status(HTTP_STATUSES.NOT_FOUND_404).send()
      return
    }
    res.status(HTTP_STATUSES.NO_CONTENT_204).send()
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
usersRouter.delete(
  '/:id',
  authMiddleware,
  idParamValidator,
  errorsResultMiddleware,
  usersController.deleteUser,
)
