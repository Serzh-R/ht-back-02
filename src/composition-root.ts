import 'reflect-metadata'
import { BlogsRepository } from './blogs/BlogsRepository'
import { BlogsService } from './blogs/BlogsService'
import { BlogsQueryRepository } from './blogs/BlogsQueryRepository'
import { BlogsController } from './blogs/BlogsController'
import { Container } from 'inversify'

// const objects: any[] = []
//
// const blogsRepository = new BlogsRepository()
// objects.push(blogsRepository)
//
// const blogsService = new BlogsService(blogsRepository)
// objects.push(blogsService)
//
// const blogsQueryRepository = new BlogsQueryRepository()
// objects.push(blogsQueryRepository)
//
// const blogsController = new BlogsController(blogsService, blogsQueryRepository)
// objects.push(blogsController)
//
// export const ioc = {
//   getInstance<T>(ClassType: any) {
//     const targetInstance = objects.find((t) => t instanceof ClassType)
//     return targetInstance
//   },
// }

export const container = new Container()
container.bind(BlogsController).to(BlogsController)
container.bind(BlogsService).to(BlogsService)
container.bind(BlogsRepository).to(BlogsRepository)
container.bind(BlogsQueryRepository).to(BlogsQueryRepository)
