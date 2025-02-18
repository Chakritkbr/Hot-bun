import nodemailer from 'nodemailer';
import { InternalServerError, BadRequestError } from '../middleware/AppError';

export const createTransporter = () => {
  const { HOST_SERVICE, ADMIN_EMAIL, ADMIN_PASS } = process.env;

  if (!HOST_SERVICE || !ADMIN_EMAIL || !ADMIN_PASS) {
    throw new BadRequestError(
      'Missing environment variables for email configuration.'
    );
  }

  return nodemailer.createTransport({
    host: HOST_SERVICE,
    port: 587,
    auth: {
      user: ADMIN_EMAIL,
      pass: ADMIN_PASS,
    },
  });
};

export const sendOtp = async (
  transporter: nodemailer.Transporter,
  email: string,
  otp: string
): Promise<void> => {
  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new InternalServerError('Error sending email');
  }
};
