import { CustomUserRequest } from './authMiddleware';
import { Request, Response } from 'express';
import {
  deleteOTP,
  getOTPFromDatabase,
  saveOTPToDatabase,
} from '../otp/otpModel';
import { genOTP, isOTPExpired } from '../otp/otpUtils';
import { createTransporter, sendOtp } from '../utils/emailUtils';
import { checkUserExists } from '../users/usersModel';
import { AuthModel } from './authModel';
import { hashPassword } from './authUtils';

export class AuthController {
  static async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      const isEmailExist = await checkUserExists(email);
      if (!isEmailExist) {
        res.status(404).json({ message: 'Email not found' });
        return;
      }
      const otp = genOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      await saveOTPToDatabase(email, otp, expiresAt);

      const transporter = createTransporter();
      await sendOtp(transporter, email, otp);

      res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
      console.error('Error sending OTP:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  }

  static async verifyOTP(req: Request, res: Response): Promise<void> {
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(400).json({ message: 'Email and OTP are required.' });
      return;
    }
    try {
      const storedOTPData = await getOTPFromDatabase(email);

      if (!storedOTPData) {
        res.status(404).json({ message: 'OTP not found' });
        return;
      }

      if (isOTPExpired(storedOTPData.expiresAt)) {
        res.status(400).json({ message: 'OTP has expired' });
        return;
      }

      await deleteOTP(email);
      res
        .status(200)
        .json({ message: 'OTP verified. Proceed with password reset.' });
    } catch (error) {
      console.error('Error verifying OTP:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  }

  static async resetPassword(req: Request, res: Response): Promise<void> {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      res.status(400).json({ message: 'Email and new password are required.' });
      return;
    }

    try {
      const hashedPassword = await hashPassword(newPassword);
      await AuthModel.updatePassword(email, hashedPassword);
      res.status(200).json({ message: 'Password reset successful.' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error.' });
    }
  }
}
