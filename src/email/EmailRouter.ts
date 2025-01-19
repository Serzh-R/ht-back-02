import { Router, Request, Response } from 'express'
import { emailService } from './EmailService'

export const emailRouter = Router()

emailRouter.post('/send', async (req: Request, res: Response) => {
  await emailService.sendEmail(req.body.email, req.body.subject, req.body.message)
})
