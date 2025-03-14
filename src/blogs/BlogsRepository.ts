import { BlogInputType, Blog } from './blog-post-types'
import { injectable } from 'inversify'
import { BlogModel } from './blog-schema'

@injectable()
export class BlogsRepository {
  async createBlog(body: BlogInputType): Promise<Blog> {
    const newBlog = await BlogModel.create({
      name: body.name,
      description: body.description,
      websiteUrl: body.websiteUrl,
      createdAt: new Date(),
      isMembership: false,
    })

    return {
      id: newBlog._id.toString(),
      name: newBlog.name,
      description: newBlog.description,
      websiteUrl: newBlog.websiteUrl,
      createdAt: newBlog.createdAt.toISOString(),
      isMembership: newBlog.isMembership,
    }
  }

  async updateBlog(id: string, body: BlogInputType): Promise<boolean> {
    if (!body.name || !body.description || !body.websiteUrl) {
      console.error('Invalid input data:', body)
      return false
    }

    const result = await BlogModel.updateOne(
      { _id: id },
      {
        $set: {
          name: body.name,
          description: body.description,
          websiteUrl: body.websiteUrl,
        },
      },
    )

    return result.matchedCount > 0
  }

  async deleteBlog(id: string): Promise<boolean> {
    const result = await BlogModel.deleteOne({ _id: id })
    return result.deletedCount > 0
  }
}

// *********************************************************************** //

/*import { BlogInputType, BlogDBInsertType, Blog } from './blog-post-types'
import { ObjectId, OptionalId } from 'mongodb'
import { injectable } from 'inversify'

@injectable()
export class BlogsRepository {
  async createBlog(body: BlogInputType): Promise<Blog> {
    const newBlog: BlogDBInsertType = {
      name: body.name ? body.name : '',
      description: body.description,
      websiteUrl: body.websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
    }

    const result = await blogsCollection.insertOne(newBlog as OptionalId<Blog>)

    return {
      id: result.insertedId.toString(),
      name: newBlog.name,
      description: newBlog.description,
      websiteUrl: newBlog.websiteUrl,
      createdAt: newBlog.createdAt,
      isMembership: newBlog.isMembership,
    } as Blog
  }

  async updateBlog(id: string, body: BlogInputType): Promise<boolean> {
    if (!body.name || !body.description || !body.websiteUrl) {
      console.error('Invalid input data:', body)
      return false
    }

    const result = await blogsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: body.name,
          description: body.description,
          websiteUrl: body.websiteUrl,
        },
      },
    )

    return result.matchedCount > 0
  }

  async deleteBlog(id: string): Promise<boolean> {
    const result = await blogsCollection.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  }
}*/
