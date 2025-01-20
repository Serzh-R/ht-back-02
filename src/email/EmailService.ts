import { emailManager } from '../managers/EmailManager'

export const emailService = {
  async doOperation() {
    // save to repo
    // get user from repo
    await emailManager.sendEmailRecoveryMessage({ user })
  },
}
