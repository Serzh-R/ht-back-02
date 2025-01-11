import { UserType } from '../types/types'

export const authService = {
  async loginUser(
    loginOrEmail: string,
    password: string,
  ): Promise<UserType | null> {
    return this.checkUserCredentials(loginOrEmail, password)
  },

  async checkUserCredentials(
    loginOrEmail: string,
    password: string,
  ): Promise<UserType | null> {
    const user = await usersRepository.findByLoginOrEmail(loginOrEmail)
    if (!user) return null

    const isPassCorrect = await bcryptService.checkPassword(
      password,
      user.passwordHash,
    )
    if (!isPassCorrect) return null

    return user
  },
}
