import otpGenerator from 'otp-generator';
import { OtpCode } from '@prisma/client';
import prisma from '../db';
import { NotFoundError } from '../middleware/AppError';
import redis from '../utils/redis';

export class OtpService {
  static async saveOTP(
    email: string,
    otp: string,
    expiresAt: Date
  ): Promise<OtpCode> {
    await redis.setex(`otp:${email}`, 600, otp);
    const existingOtp = await prisma.otpCode.findFirst({ where: { email } });

    if (existingOtp) {
      return prisma.otpCode.update({
        where: { email },
        data: { otp, expiresAt },
      });
    }

    return prisma.otpCode.create({ data: { email, otp, expiresAt } });
  }

  // ฟังก์ชันดึง OTP จาก Redis หรือ Fallback ไปที่ Database
  static async getOTP(email: string): Promise<OtpCode> {
    const otp = await redis.get(`otp:${email}`);
    if (otp) {
      const otpCode: OtpCode = {
        id: -1, // กำหนด -1 เพื่อบ่งบอกว่าไม่ใช่ค่าจากฐานข้อมูล
        email,
        otp,
        expiresAt: new Date(Date.now() + 600000), // กำหนดเวลาให้หมดอายุใน 10 นาที
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return otpCode;
    }
    // Fallback ไปที่ Database ถ้า OTP ไม่พบใน Redis
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
    await redis.del(`otp:${email}`);
    await prisma.otpCode.deleteMany({ where: { email } });
  }

  static genOTP(): string {
    return otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
    });
  }

  static isOTPExpired(expiresAt: Date): boolean {
    return new Date() > expiresAt;
  }
}

export default OtpService;
