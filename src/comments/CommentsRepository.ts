import { ObjectId } from 'mongodb'
import { CommentDB, Like, LikesInfo, LikeStatus } from './comment-types'
import { CommentModel } from './comment-schema'

class CommentsRepository {
  async updateCommentLikeStatus(
    commentId: string,
    userId: string,
    likeStatus: LikeStatus,
  ): Promise<boolean> {
    const comment = await CommentModel.findOne({ _id: commentId })

    if (!comment) {
      return false
    }

    let existingLike = comment.likesInfo.likes.find((like) => like.userId === userId)

    if (existingLike && existingLike.myStatus === likeStatus) {
      return true
    }

    if (existingLike) {
      existingLike.myStatus = likeStatus
      existingLike.createdAt = new Date()
    } else {
      comment.likesInfo.likes.push(new Like(userId, new Date(), likeStatus))
    }

    const likesCount = comment.likesInfo.likes.filter(
      (like) => like.myStatus === LikeStatus.Like,
    ).length
    const dislikesCount = comment.likesInfo.likes.filter(
      (like) => like.myStatus === LikeStatus.Dislike,
    ).length

    comment.likesInfo.likesCount = likesCount
    comment.likesInfo.dislikesCount = dislikesCount

    await comment.save()
    return true
  }

  // async updateCommentLikeStatus(
  //   commentId: string,
  //   userId: string,
  //   likeStatus: LikeStatus,
  // ): Promise<boolean> {
  //   const result = await CommentModel.updateOne(
  //     { _id: commentId, 'likesInfo.userId': userId }, // Проверяем, есть ли лайк от этого пользователя
  //     { $set: { 'likesInfo.myStatus': likeStatus } }, // Обновляем статус лайка
  //   )
  //
  //   // Если не найден лайк от пользователя, добавляем новый лайк
  //   if (result.matchedCount === 0) {
  //     await CommentModel.updateOne(
  //       { _id: commentId },
  //       {
  //         $push: {
  //           likesInfo: { userId, myStatus: likeStatus },
  //         },
  //       },
  //     )
  //     return true
  //   }
  //
  //   return result.modifiedCount > 0
  // }

  async updateCommentById(id: string, content: string): Promise<boolean> {
    const result = await CommentModel.updateOne({ _id: id }, { $set: { content } })
    return result.matchedCount > 0
  }

  async createComment(comment: Omit<CommentDB, '_id'>): Promise<ObjectId> {
    const newComment = await CommentModel.create(comment)
    return newComment._id
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await CommentModel.deleteOne({ _id: id })
    return result.deletedCount > 0
  }
}

export const commentsRepository = new CommentsRepository()

// ********************************************************************** //

/*
import { commentsCollection } from '../db/mongoDb'
import { ObjectId } from 'mongodb'
import { CommentDB } from './comment-types'

class CommentsRepository {
  async updateCommentById(id: string, content: string): Promise<boolean> {
    const result = await commentsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { content } },
    )
    return result.matchedCount > 0
  }

  async createComment(commentData: {
    content: string
    commentatorInfo: { userId: string; userLogin: string }
    createdAt: Date
    postId: ObjectId
  }): Promise<ObjectId> {
    const result = await commentsCollection.insertOne({
      content: commentData.content,
      commentatorInfo: commentData.commentatorInfo,
      createdAt: commentData.createdAt,
      postId: commentData.postId,
    } as CommentDB)

    return result.insertedId
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await commentsCollection.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  }
}

export const commentsRepository = new CommentsRepository()
*/
