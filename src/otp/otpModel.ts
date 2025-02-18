import otpGenerator from 'otp-generator';
import { OtpCode } from '@prisma/client';
import prisma from '../db';
import { BadRequestError, NotFoundError } from '../middleware/AppError';

export class OtpService {
  static async saveOTPToDatabase(
    email: string,
    otp: string,
    expiresAt: Date
  ): Promise<OtpCode> {
    const existingOtp = await prisma.otpCode.findFirst({ where: { email } });

    if (existingOtp) {
      return prisma.otpCode.update({
        where: { email },
        data: { otp, expiresAt },
      });
    }

    return prisma.otpCode.create({ data: { email, otp, expiresAt } });
  }

  static async getOTPFromDatabase(email: string): Promise<OtpCode> {
    const otpCode = await prisma.otpCode.findFirst({
      where: { email },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpCode) {
      throw new NotFoundError('OTP not found');
    }

    return otpCode;
  }

  static async deleteOTP(email: string): Promise<void> {
    await prisma.otpCode.deleteMany({ where: { email } });
  }

  static genOTP(): string {
    return otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
    });
  }

  static isOTPExpired(expiresAt: Date): void {
    if (new Date() > expiresAt) {
      throw new BadRequestError('OTP has expired');
    }
  }
}

export default OtpService;
