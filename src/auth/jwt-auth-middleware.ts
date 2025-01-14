import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { SETTINGS } from '../settings'

export const jwtAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.sendStatus(401) // Unauthorized
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, SETTINGS.JWT_SECRET) // Проверка токена
    req.user = decoded // Добавляем информацию о пользователе в запрос
    next()
  } catch (err) {
    return res.sendStatus(403) // Forbidden
  }
}
