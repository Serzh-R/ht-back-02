import { Request, Response, NextFunction } from 'express'
import { requestsCollection } from '../db/mongoDb'
import { HTTP_STATUSES } from '../settings'

export const countRequestsMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { IP } = req.query
    const tenSecondsAgo = new Date(Date.now() - 10 * 1000)

    const filter: any = {
      date: { $gte: tenSecondsAgo },
    }

    if (IP) {
      filter.IP = String(IP)
    } else {
      filter.IP = req.ip
    }

    if (URL) {
      filter.URL = String(URL)
    }

    const count = await requestsCollection.countDocuments(filter)

    if (count >= 5) {
      res.status(HTTP_STATUSES.TOO_MANY_REQUESTS_429).json({
        error: 'Too Many Requests',
        message:
          'You have exceeded the maximum number of requests allowed (5 requests per 10 seconds). Please try again later.',
      })
      return
    }

    res.locals.count = count

    await requestsCollection.insertOne({
      IP: req.ip ?? '',
      URL: req.originalUrl,
      date: new Date(),
    })

    next()
  } catch (error) {
    console.error('Error counting requests:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
