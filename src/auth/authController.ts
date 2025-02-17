import { Request, Response } from 'express';
import { createTransporter, sendOtp } from '../utils/emailUtils';
import { checkUserExists } from '../users/usersModel';
import { AuthModel } from './authModel';
import {
  authEmailValidate,
  authPasswordResetValidate,
} from '../utils/validateUtils';
import OtpService from '../otp/otpModel';

export class AuthController {
  static async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      const { error } = authEmailValidate.validate(req.body);
      if (error) {
        res.status(400).json({
          status: 'error',
          message: error.details[0].message,
        });
        return;
      }

      const isEmailExist = await checkUserExists(email);
      if (!isEmailExist) {
        res.status(404).json({ status: 'error', message: 'Email not found' });
        return;
      }
      const otp = OtpService.genOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      await OtpService.saveOTPToDatabase(email, otp, expiresAt);

      const transporter = createTransporter();
      await sendOtp(transporter, email, otp);

      res.status(200).json({
        status: 'success',
        message: 'OTP sent successfully',
      });
    } catch (error) {
      console.error('Error sending OTP:', error);
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  static async verifyOTP(req: Request, res: Response): Promise<void> {
    const { email, otp } = req.body;

    if (!email || !otp) {
      res
        .status(400)
        .json({ status: 'error', message: 'Email and OTP are required.' });
      return;
    }
    try {
      const storedOTPData = await OtpService.getOTPFromDatabase(email);

      if (!storedOTPData) {
        res.status(404).json({ status: 'error', message: 'OTP not found' });
        return;
      }

      if (OtpService.isOTPExpired(storedOTPData.expiresAt)) {
        res.status(400).json({ status: 'error', message: 'OTP has expired' });
        return;
      }

      await OtpService.deleteOTP(email);
      res.status(200).json({
        status: 'success',
        message: 'OTP verified. Proceed with password reset.',
      });
    } catch (error) {
      console.error('Error verifying OTP:', error);
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  static async resetPassword(req: Request, res: Response): Promise<void> {
    const { email, newPassword, otp } = req.body;
    const { error } = authPasswordResetValidate.validate({
      email,
      newPassword,
    });
    if (error) {
      res.status(400).json({
        status: 'error',
        message: error.details[0].message,
      });
      return; // Stop execution if validation fails
    }

    try {
      const otpRecord = await OtpService.getOTPFromDatabase(email);
      if (!otpRecord || otpRecord.otp !== otp) {
        res.status(400).json({ status: 'error', message: 'OTP ไม่ถูกต้อง' });
        return;
      }
      if (OtpService.isOTPExpired(otpRecord.expiresAt)) {
        res
          .status(400)
          .json({ status: 'error', message: 'OTP หมดอายุ กรุณาขอ OTP ใหม่' });
        return;
      }
      await AuthModel.updatePassword(email, newPassword);
      await OtpService.deleteOTP(email);
      res.status(200).json({
        status: 'success',
        message: 'Password reset successful.',
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
