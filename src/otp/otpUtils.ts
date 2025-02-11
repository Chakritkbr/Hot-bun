import otpGenerator from 'otp-generator';

// ฟังก์ชันสำหรับการสร้าง OTP
export const genOTP = (): string => {
  return otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
  });
};

// ฟังก์ชันสำหรับการตรวจสอบว่า OTP หมดอายุหรือไม่
export const isOTPExpired = (expiresAt: Date): boolean => {
  const currentTime = new Date();
  return currentTime > expiresAt;
};
