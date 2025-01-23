import { emailAdapter } from '../email/EmailAdapter'
import { UserRegInsertDBType } from '../auth/types/types'

export const emailManager = {
  async sendEmailConfirmationMessage(user: UserRegInsertDBType) {
    const subject = 'Подтверждение регистрации'
    const message = `<h1>Добро пожаловать!</h1>
      <p>Для завершения регистрации перейдите по ссылке ниже:</p>
      <a href="http://localhost:3004/confirm?code=${user.emailConfirmation.confirmationCode}">Подтвердить email</a>`
    await emailAdapter.sendEmail(user.email, subject, message)
  },
}
