import bcrypt from 'bcrypt'
import { BCRYPT_SALT } from '../../settings'

export const bcryptService = {
  async generateHash(password: string): Promise<{ passwordHash: string }> {
    const passwordHash = await bcrypt.hash(password, BCRYPT_SALT)
    return { passwordHash }
  },

  async checkPassword(password: string, passwordHash: string) {
    return bcrypt.compare(password, passwordHash)
  },
}
