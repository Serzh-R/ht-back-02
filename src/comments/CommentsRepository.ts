import { commentsCollection } from '../db/mongoDb'
import { ObjectId } from 'mongodb'

export const commentsRepository = {
  /*async findById(id: string): Promise<CommentDBType | null> {
    const comment = await commentsCollection.findOne({ _id: new ObjectId(id) })
    return comment
  },*/

  async updateCommentById(id: string, content: string): Promise<boolean> {
    const result = await commentsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { content } },
    )
    return result.matchedCount > 0
  },

  async deleteById(id: string): Promise<boolean> {
    const result = await commentsCollection.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  },
}
