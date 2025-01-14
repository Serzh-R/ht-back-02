import bcrypt from 'bcrypt'

export const bcryptService = {
  async generateHash(password: string): Promise<{ passwordHash: string; passwordSalt: string }> {
    const passwordSalt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, passwordSalt)
    return { passwordHash, passwordSalt }
  },

  async checkPassword(password: string, passwordHash: string) {
    return bcrypt.compare(password, passwordHash)
  },
}
