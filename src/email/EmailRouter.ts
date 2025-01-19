import { Router, Request, Response } from 'express'
import { emailAdapter } from '../common/adapters/email.adapter'

export const emailRouter = Router()

emailRouter.post('/send', async (req: Request, res: Response) => {
  await emailAdapter.sendEmail(req.body.email, req.body.subject, req.body.message)
})
