import { Request, Response, NextFunction } from 'express'
import { requestsCollection } from '../db/mongoDb'

export const countRequestsMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { IP, URL } = req.query
    const tenSecondsAgo = new Date(Date.now() - 10 * 1000) // 10 секунд назад

    const filter: any = {
      date: { $gte: tenSecondsAgo }, // Дата больше или равна 10 секунд назад
    }

    if (IP) {
      filter.IP = IP
    }

    if (URL) {
      filter.URL = URL
    }

    const count = await requestsCollection.countDocuments(filter)

    res.locals.count = count

    next()
  } catch (error) {
    console.error('Error counting requests:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
