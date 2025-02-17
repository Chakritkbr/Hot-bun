import prisma from '../db';
import { hashPassword } from './authUtils';

export class AuthModel {
  static async updatePassword(email: string, newPassword: string) {
    const hashedPassword = await hashPassword(newPassword);
    prisma.user.update({
      where: { email },
      data: { password: newPassword },
    });
  }
}
