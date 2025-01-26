/*import nodemailer from 'nodemailer'
import { SETTINGS } from '../settings'

export const emailAdapter = {
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
        from: `"Serzh" <${SETTINGS.EMAIL.USER}>`,
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
  },
}*/

import nodemailer from 'nodemailer'

export const emailAdapter = {
  async sendEmail(email: string, subject: string, message: string) {
    let transport = nodemailer.createTransport({
      service: 'yandex',
      auth: {
        user: 'sr.ti@yandex.kz',
        pass: 'ttqcetfecpwpxbub',
      },
    })

    try {
      let info = await transport.sendMail({
        from: 'Serzh <sr.ti@yandex.kz>',
        to: email,
        subject: subject,
        html: message,
      })
      return info
    } catch (error) {
      console.error('Failed to send email:', error)
      throw new Error('Email sending failed')
    }
  },
}
