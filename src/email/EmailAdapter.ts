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

    let info = transport.sendMail({
      from: 'Serzh <sr.ti@yandex.kz>',
      to: email,
      subject: subject,
      html: message,
    })
    return info
  },
}
