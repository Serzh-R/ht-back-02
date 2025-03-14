import { BlogDB, Blog, PaginatorBlogType } from './blog-post-types'
import { injectable } from 'inversify'
import { BlogModel } from './blog-schema'
import { WithId } from 'mongodb'

@injectable()
export class BlogsQueryRepository {
  async getBlogs(
    searchNameTerm: string | null,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    pageNumber: number,
    pageSize: number,
  ): Promise<PaginatorBlogType> {
    const filter: any = {}

    if (searchNameTerm) {
      filter.name = { $regex: searchNameTerm, $options: 'i' }
    }

    const blogsCount = await BlogModel.countDocuments(filter)

    const blogs = await BlogModel.find(filter)
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .select('-__v') // Убираем служебное поле Mongoose
      .lean()

    return {
      pagesCount: Math.ceil(blogsCount / pageSize),
      page: pageNumber,
      pageSize,
      totalCount: blogsCount,
      items: blogs.map((blog) => this._getInView(blog)),
    }
  }

  async getBlogsCount(searchNameTerm: string | null): Promise<number> {
    const filter: any = {}
    if (searchNameTerm) {
      filter.name = { $regex: searchNameTerm, $options: 'i' }
    }
    return await BlogModel.countDocuments(filter)
  }

  async getBlogById(blogId: string): Promise<Blog | null> {
    if (!this._checkObjectId(blogId)) return null

    const blog = await BlogModel.findById(blogId).select('-__v').lean()
    return blog ? this._getInView(blog) : null
  }

  _getInView(blog: WithId<BlogDB>): Blog {
    return {
      id: blog._id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt.toISOString(),
      isMembership: blog.isMembership,
    }
  }

  _checkObjectId(id: string): boolean {
    return /^[0-9a-fA-F]{24}$/.test(id)
  }
}

// ******************************************************************** //

/*import { BlogDB, Blog, PaginatorBlogType } from './blog-post-types'
import { blogsCollection } from '../db/mongoDb'
import { ObjectId, WithId } from 'mongodb'
import { injectable } from 'inversify'

@injectable()
export class BlogsQueryRepository {
  async getBlogs(
    searchNameTerm: string | null,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    pageNumber: number,
    pageSize: number,
  ): Promise<PaginatorBlogType> {
    const filter: any = {}

    if (searchNameTerm) {
      filter.name = { $regex: searchNameTerm, $options: 'i' }
    }

    const blogsCount = await blogsCollection.countDocuments(filter)

    const blogs = await blogsCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray()

    console.log('Returned blogs from MongoDB:', blogs)

    return {
      pagesCount: Math.ceil(blogsCount / pageSize),
      page: pageNumber,
      pageSize,
      totalCount: blogsCount,
      items: blogs.map((blog) => this._getInView(blog)),
    }
  }

  async getBlogsCount(searchNameTerm: string | null): Promise<number> {
    const filter: any = {}
    if (searchNameTerm) {
      filter.name = { $regex: searchNameTerm, $options: 'i' }
    }
    return blogsCollection.countDocuments(filter)
  }

  async getBlogById(blogId: string): Promise<Blog | null> {
    if (!ObjectId.isValid(blogId)) return null
    const blog = await blogsCollection.findOne({ _id: new ObjectId(blogId) })
    return blog ? this._getInView(blog) : null
  }

  _getInView(blog: WithId<BlogDB>): Blog {
    return {
      id: blog._id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt.toString(),
      isMembership: blog.isMembership,
    }
  }
  _checkObjectId(id: string): boolean {
    return ObjectId.isValid(id)
  }
}*/
