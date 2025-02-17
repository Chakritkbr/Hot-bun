import { OtpCode } from '@prisma/client';
import UserModel from '../users/usersModel';
import prisma from '../db';

export class AuthModel {
  static async updatePassword(email: string, newPassword: string) {
    return prisma.user.update({
      where: { email },
      data: { password: newPassword },
    });
  }
}
