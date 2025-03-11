import { BlogsRepository } from './blogs/BlogsRepository'
import { BlogsService } from './blogs/BlogsService'
import { BlogsController } from './blogs/BlogsRouter'
import { BlogsQueryRepository } from './blogs/BlogsQueryRepository'

const blogsRepository = new BlogsRepository()

const blogsService = new BlogsService(blogsRepository)

const blogsQueryRepository = new BlogsQueryRepository()

export const blogsController = new BlogsController(blogsService, blogsQueryRepository)
