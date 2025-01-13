import { usersRepository } from '../users/UsersRepository'
import bcrypt from 'bcrypt'

export const authService = {
  async checkCredentials(
    loginOrEmail: string,
    password: string,
  ): Promise<boolean> {
    const user = await usersRepository.findByLoginOrEmail(loginOrEmail)
    if (!user) return false

    const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash)
    return isPasswordCorrect
  },
}
