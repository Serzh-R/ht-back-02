import { emailAdapter } from './EmailAdapter'
import { UserRegInsertDBType } from '../users/user-types'

export const emailManager = {
  async sendEmailConfirmationMessage(user: UserRegInsertDBType) {
    const subject = 'Подтверждение регистрации'
    const message = `<h1>Добро пожаловать!</h1>
      <p>Для завершения регистрации перейдите по ссылке ниже:</p>
      <a href="http://localhost:3004/confirm?code=${user.emailConfirmation.confirmationCode}">Подтвердить email</a>`
    await emailAdapter.sendEmail(user.email, subject, message)
  },

  async sendEmailPasswordRecovery(user: UserRegInsertDBType) {
    const subject = 'Password Recovery'
    const message = `<h1>Password recovery</h1>
          <p>Для завершения восстановления пароля перейдите по ссылке ниже:</p>
    <a href="http://localhost:3004/password-recovery?recoveryCode=${user.emailConfirmation.confirmationCode}">recovery password</a>`
    await emailAdapter.sendEmail(user.email, subject, message)
  },
}
