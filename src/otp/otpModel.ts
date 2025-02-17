import otpGenerator from 'otp-generator';
import { OtpCode } from '@prisma/client';
import prisma from '../db';

export class OtpService {
  static async saveOTPToDatabase(
    email: string,
    otp: string,
    expiresAt: Date
  ): Promise<OtpCode> {
    const existingOtp = await prisma.otpCode.findFirst({
      where: { email },
    });
    if (existingOtp) {
      return prisma.otpCode.update({
        where: { email },
        data: {
          otp,
          expiresAt,
        },
      });
    } else {
      return prisma.otpCode.create({
        data: {
          email,
          otp,
          expiresAt,
        },
      });
    }
  }
  static async getOTPFromDatabase(email: string): Promise<OtpCode | null> {
    const otpCode = await prisma.otpCode.findFirst({
      where: { email },
      orderBy: { createdAt: 'desc' },
    });
    return otpCode;
  }
  static async deleteOTP(email: string): Promise<void> {
    await prisma.otpCode.deleteMany({
      where: { email },
    });
  }
  static genOTP(): string {
    return otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
    });
  }
  static isOTPExpired(expiresAt: Date): boolean {
    const currentTime = new Date();
    return currentTime > expiresAt;
  }
}
export default OtpService;
