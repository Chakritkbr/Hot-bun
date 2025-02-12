import { NextFunction, Request, Response } from 'express';
import { UserInterface, verifyToken } from './authUtils';
import prisma from '../db';

export interface CustomUserRequest extends Request {
  user?: UserInterface;
}

export const authenticateToken = async (
  req: CustomUserRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const token =
    authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null;

  if (!token) {
    res.status(401).json({ message: 'Token is required' });
    return;
  }

  try {
    const payload = verifyToken(token);
    if (!payload || !payload.id) {
      res.status(403).json({ message: 'Invalid or expired token.' });
      return;
    }

    // 🔥 ดึงข้อมูล user จาก database
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { id: true, email: true, role: true }, // ดึง role มาด้วย
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // ✅ ใส่ข้อมูล user ลงไปใน req
    req.user = user as UserInterface;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const authorizeUser = (
  req: CustomUserRequest,
  res: Response,
  next: NextFunction
): void => {
  const userId = req.user?.id;
  const { id } = req.params;

  if (!userId) {
    res.status(401).json({ message: 'Unauthorized access' });
    return;
  }

  if (userId !== id) {
    res
      .status(403)
      .json({ message: 'You are not authorized to access this resource' });
    return;
  }

  next(); // ส่งต่อไปยัง middleware หรือ route handler ถัดไป
};

export const authorizeRole = (roles: string[]) => {
  return (req: CustomUserRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !req.user.role || !roles.includes(req.user.role)) {
      res
        .status(403)
        .json({ message: 'Access denied. Insufficient permissions.' });
      return;
    }
    next();
  };
};
