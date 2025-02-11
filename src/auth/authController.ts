import { CustomUserRequest } from './authMiddleware';
import {
  deleteOTP,
  getOTPFromDatabase,
  saveOTPToDatabase,
} from '../otp/otpModel';
import { genOTP, isOTPExpired } from '../otp/otpUtils';
import { sendOtp } from '../utils/emailUtils';
import { Request, Response } from 'express';

// การรีเซ็ตรหัสผ่าน (forgot password)
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const otp = genOTP();
    const expiresAt = new Date(Date.now() + 10 * 60000); // 10 นาที

    await saveOTPToDatabase(email, otp, expiresAt);

    await sendOtp(email, otp); // ส่ง OTP ไปยังอีเมล

    res.status(200).json({ message: 'OTP sent to your email.' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// การตรวจสอบ OTP
export const verifyOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required.' });
  }

  try {
    const storedOTPData = await getOTPFromDatabase(email);

    if (!storedOTPData) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    const { otp: storedOTP, expiresAt } = storedOTPData;

    if (storedOTP !== otp) {
      return res.status(400).json({ message: 'Invalid OTP.' });
    }

    if (isOTPExpired(expiresAt)) {
      return res.status(400).json({ message: 'OTP expired.' });
    }

    await deleteOTP(email);

    res
      .status(200)
      .json({ message: 'OTP verified. Proceed with password reset.' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// ฟังก์ชันการเข้าถึงเส้นทางที่ต้องการการพิสูจน์ตัวตน
export const protectedAdmin = (req: CustomUserRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized access.' });
  }

  // Route ที่เข้าถึงได้หลังจากพิสูจน์ตัวตน
  res
    .status(200)
    .json({ message: 'This is a protected route.', user: req.user });
};
