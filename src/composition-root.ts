import { BlogsRepository } from './blogs/BlogsRepository'
import { BlogsService } from './blogs/BlogsService'
import { BlogsQueryRepository } from './blogs/BlogsQueryRepository'
import { BlogsController } from './blogs/BlogsController'

const blogsRepository = new BlogsRepository()

const blogsService = new BlogsService(blogsRepository)

const blogsQueryRepository = new BlogsQueryRepository()

export const blogsController = new BlogsController(blogsService, blogsQueryRepository)
