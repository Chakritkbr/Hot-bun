import nodemailer from 'nodemailer';

export const createTransporter = () => {
  if (
    !process.env.HOST_SERVICE ||
    !process.env.ADMIN_EMAIL ||
    !process.env.ADMIN_PASS
  ) {
    throw new Error('Missing environment variables for email configuration.');
  }
  return nodemailer.createTransport({
    host: process.env.HOST_SERVICE,
    port: 587,
    auth: {
      user: process.env.ADMIN_EMAIL,
      pass: process.env.ADMIN_PASS,
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
    console.log('Error sending email:', error);
    throw new Error('Error sending email');
  }
};
