import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import jwt, { SignOptions } from 'jsonwebtoken';

export interface UserInterface {
  id: string;
  email: string;
  password: string;
  role?: string;
}

export interface TokenPayload {
  id: string;
  email: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'mamamiayoohoo';

export const genToken = (payload: object, expiresIn: number = 3600): string => {
  // ใช้ number สำหรับ expiresIn แทน string
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, JWT_SECRET, options);
};

// ฟังก์ชันสำหรับการตรวจสอบ Token
export const verifyToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      console.error('Token expired:', err.message);
    } else {
      console.error('Token verification error:', (err as Error).message);
    }
    return null;
  }
};

// ฟังก์ชันสำหรับการเข้ารหัสรหัสผ่าน
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

// ฟังก์ชันสำหรับการตรวจสอบรหัสผ่าน
export const checkPassword = async (
  inputPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(inputPassword, hashedPassword);
};

export const generateUserId = (): string => {
  return uuidv4();
};
