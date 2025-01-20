import { emailAdapter } from '../email/EmailAdapter'

export const emailManager = {
  async sendEmailRecoveryMessage(user: any) {
    await emailAdapter.sendEmail(user.email, user.subject, user.message)
  },
}
