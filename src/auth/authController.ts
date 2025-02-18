import { Request, Response } from 'express';
import { createTransporter, sendOtp } from '../utils/emailUtils';
import { checkUserExists } from '../users/usersModel';
import { AuthModel } from './authModel';
import {
  authEmailValidate,
  authPasswordResetValidate,
} from '../utils/validateUtils';
import OtpService from '../otp/otpModel';
import { BadRequestError, NotFoundError } from '../middleware/AppError';
import { asyncHandler } from '../middleware/asyncHandler';

export class AuthController {
  static forgotPassword = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { email } = req.body;
      const { error } = authEmailValidate.validate(req.body);
      if (error) {
        throw new BadRequestError(error.details[0].message);
      }

      const isEmailExist = await checkUserExists(email);
      if (!isEmailExist) {
        throw new NotFoundError('Email not found');
      }

      const otp = OtpService.genOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

      await OtpService.saveOTPToDatabase(email, otp, expiresAt);

      const transporter = createTransporter();
      await sendOtp(transporter, email, otp);

      res.status(200).json({
        status: 'success',
        message: 'OTP sent successfully',
      });
    }
  );

  static verifyOTP = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { email, otp } = req.body;

      if (!email || !otp) {
        throw new BadRequestError('Email and OTP are required');
      }

      const storedOTPData = await OtpService.getOTPFromDatabase(email);
      if (!storedOTPData) {
        throw new NotFoundError('OTP not found');
      }

      if (OtpService.isOTPExpired(storedOTPData.expiresAt)) {
        throw new BadRequestError('OTP has expired');
      }

      await OtpService.deleteOTP(email);
      res.status(200).json({
        status: 'success',
        message: 'OTP verified. Proceed with password reset.',
      });
    }
  );

  static resetPassword = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { email, newPassword, otp } = req.body;
      const { error } = authPasswordResetValidate.validate({
        email,
        newPassword,
      });
      if (error) {
        throw new BadRequestError(error.details[0].message);
      }

      const otpRecord = await OtpService.getOTPFromDatabase(email);
      if (!otpRecord || otpRecord.otp !== otp) {
        throw new BadRequestError('Incorrect OTP');
      }

      if (OtpService.isOTPExpired(otpRecord.expiresAt)) {
        throw new BadRequestError('OTP expired. Please request a new OTP');
      }

      await AuthModel.updatePassword(email, newPassword);
      await OtpService.deleteOTP(email);

      res.status(200).json({
        status: 'success',
        message: 'Password reset successful.',
      });
    }
  );
}
