import { BlogDBType, BlogType, PaginatorBlogType } from '../types/types'
import { blogsCollection } from '../db/mongoDb'
import { ObjectId, WithId } from 'mongodb'

export const blogsQueryRepository = {
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
  },

  async getBlogsCount(searchNameTerm: string | null): Promise<number> {
    const filter: any = {}
    if (searchNameTerm) {
      filter.name = { $regex: searchNameTerm, $options: 'i' }
    }
    return blogsCollection.countDocuments(filter)
  },

  async getBlogById(blogId: string): Promise<BlogType | null> {
    const blog = await blogsCollection.findOne({ _id: new ObjectId(blogId) })
    return blog ? this._getInView(blog) : null
  },

  _getInView(blog: WithId<BlogDBType>): BlogType {
    return {
      id: blog._id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
      isMembership: blog.isMembership,
    }
  },
  _checkObjectId(id: string): boolean {
    return ObjectId.isValid(id)
  },
}
