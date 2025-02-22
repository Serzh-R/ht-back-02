import { Request, Response, NextFunction } from 'express'
import { requestsCollection } from '../db/mongoDb'
import { HTTP_STATUSES } from '../settings'

export const countRequestsMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ip, originalUrl } = req
    const tenSecondsAgo = new Date(Date.now() - 10 * 1000)

    const filter: any = {
      date: { $gte: tenSecondsAgo },
      ip,
      url: originalUrl,
    }
    const count = await requestsCollection.countDocuments(filter)

    await requestsCollection.insertOne({
      ip: ip ?? 'default',
      url: originalUrl,
      date: new Date(),
    })

    if (count >= 5) {
      res.status(HTTP_STATUSES.TOO_MANY_REQUESTS_429).json({
        error: 'Too Many Requests',
        message:
          'You have exceeded the maximum number of requests allowed (5 requests per 10 seconds). Please try again later.',
      })
      return
    }

    res.locals.count = count

    //Удаление старых записей
    await requestsCollection.deleteMany({
      date: { $lt: tenSecondsAgo },
    })

    next()
  } catch (error) {
    console.error('Error counting requests:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
