/*
import { Request, Response, NextFunction } from 'express'
import { HTTP_STATUSES, REQUEST_LIMIT } from '../settings'

export const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress
  const url = req.originalUrl || req.baseUrl

  // Логируем запрос
  await requestLogsRepository.logRequest(ip as string, url)

  // Считаем количество запросов за последние 10 секунд
  const requestCount = await requestLogsRepository.countRequests(ip as string, url)

  if (requestCount > REQUEST_LIMIT) {
    return res.status(HTTP_STATUSES.TOO_MANY_REQUESTS_429).json({
      message: 'Too many requests. Please try again later.',
    })
  }

  next()
}
*/
