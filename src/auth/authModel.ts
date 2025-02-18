import prisma from '../db';
import { NotFoundError } from '../middleware/AppError';
import { hashPassword } from './authUtils';

export class AuthModel {
  static async updatePassword(email: string, newPassword: string) {
    try {
      const hashedPassword = await hashPassword(newPassword);
      const updatedUser = await prisma.user.update({
        where: { email },
        data: { password: hashedPassword },
      });
      if (!updatedUser) {
        throw new NotFoundError('User not found');
      }
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Error updating password'
      );
    }
  }
}
