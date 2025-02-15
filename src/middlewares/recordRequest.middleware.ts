import { Request, Response, NextFunction } from 'express'
import { requestsCollection } from '../db/mongoDb'

export const recordRequest = async (req: Request, res: Response, next: NextFunction) => {
  const requestData = {
    IP: req.ip ?? '',
    URL: req.originalUrl,
    date: new Date(),
  }
  try {
    await requestsCollection.insertOne(requestData)
    next()
  } catch (err) {
    console.error('Error saving request data:', err)
    next()
  }
}
