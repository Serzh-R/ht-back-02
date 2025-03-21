import nodemailer from 'nodemailer'
import { SETTINGS } from '../settings'

class EmailAdapter {
  async sendEmail(email: string, subject: string, message: string) {
    try {
      const transport = nodemailer.createTransport({
        service: 'yandex',
        auth: {
          user: SETTINGS.EMAIL.USER,
          pass: SETTINGS.EMAIL.PASS,
        },
      })

      const info = await transport.sendMail({
        from: 'Serzh <sr.ti@yandex.kz>',
        to: email,
        subject: subject,
        html: message,
      })

      console.log(`Email sent to ${email}: ${info.messageId}`)
      return { success: true, messageId: info.messageId }
    } catch (error) {
      console.error('Failed to send email:', error)
      return { success: false, error: 'Email sending failed' }
    }
  }
}

export const emailAdapter = new EmailAdapter()
