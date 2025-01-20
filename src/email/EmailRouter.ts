import { Router, Request, Response } from 'express'
import { emailService } from './EmailService'

export const emailRouter = Router()

emailRouter.post('/send', async (req: Request, res: Response) => {
  await emailService.doOperation(req.body)
})
