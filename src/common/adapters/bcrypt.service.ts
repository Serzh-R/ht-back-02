import bcrypt from 'bcrypt'
import { BCRYPT_SALT } from '../../settings'

export const bcryptService = {
  async generateHash(password: string): Promise<string> {
    return await bcrypt.hash(password, BCRYPT_SALT)
  },

  async checkPassword(password: string, passwordHash: string) {
    return bcrypt.compare(password, passwordHash)
  },
}
