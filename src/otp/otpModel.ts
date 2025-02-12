import { PrismaClient, OtpCode } from '@prisma/client';

const prisma = new PrismaClient();

// ฟังก์ชันสำหรับบันทึก OTP ลงในฐานข้อมูล
export const saveOTPToDatabase = async (
  email: string,
  otp: string,
  expiresAt: Date
): Promise<OtpCode> => {
  const otpCode: OtpCode = await prisma.otpCode.create({
    data: {
      email,
      otp,
      expiresAt,
    },
  });

  return otpCode;
};

// ฟังก์ชันสำหรับดึง OTP จากฐานข้อมูล
export const getOTPFromDatabase = async (
  email: string
): Promise<OtpCode | null> => {
  const otpCode = await prisma.otpCode.findFirst({
    where: { email },
    orderBy: { createdAt: 'desc' },
  });

  return otpCode;
};

// ฟังก์ชันสำหรับลบ OTP จากฐานข้อมูล
export const deleteOTP = async (email: string): Promise<void> => {
  await prisma.otpCode.deleteMany({
    where: { email },
  });
};
