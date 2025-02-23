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

    //await new Promise((resolve) => setTimeout(resolve, 50))

    const count = await requestsCollection.countDocuments(filter)

    await requestsCollection.insertOne({
      ip: ip ?? 'default',
      url: originalUrl,
      date: new Date(),
    })

    // смотрим логи
    console.log('Filter:', filter)
    console.log('Count:', count)
    const allRequests = await requestsCollection.find().toArray()
    console.log('All Requests:', allRequests)

    if (count >= 5) {
      res.status(HTTP_STATUSES.TOO_MANY_REQUESTS_429).json({
        error: 'Too Many Requests',
        message:
          'You have exceeded the maximum number of requests allowed (5 requests per 10 seconds). Please try again later.',
      })
      return
    }

    res.locals.count = count

    // await requestsCollection.deleteMany({
    //   date: { $lt: tenSecondsAgo },
    // })

    next()

    // await requestsCollection.deleteMany({
    //   date: { $lt: tenSecondsAgo },
    // })
  } catch (error) {
    console.error('Error counting requests:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
