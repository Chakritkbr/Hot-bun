import { NextFunction, Request, Response } from 'express';
import { UserInterface, verifyToken } from './authUtils';
import prisma from '../db';
import {
  ForbiddenError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from '../middleware/AppError';

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
    return next(new UnauthorizedError('Token is required'));
  }

  try {
    const payload = verifyToken(token);
    if (!payload || !payload.id) {
      return next(new ForbiddenError('Token is invalid or expired'));
    }

    // 🔥 ดึงข้อมูล user จาก database
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { id: true, email: true, role: true }, // ดึง role มาด้วย
    });

    if (!user) {
      return next(new NotFoundError('User not found'));
    }

    // ✅ ใส่ข้อมูล user ลงไปใน req

    req.user = user as UserInterface;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return next(new InternalServerError());
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
    return next(new UnauthorizedError('Unauthorized access'));
  }

  if (userId !== id) {
    return next(
      new ForbiddenError('You are not authorized to access this resource')
    );
  }

  next(); // ส่งต่อไปยัง middleware หรือ route handler ถัดไป
};

export const authorizeRole = (roles: string[]) => {
  return (req: CustomUserRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !req.user.role || !roles.includes(req.user.role)) {
      return next(
        new ForbiddenError('Access denied. Insufficient permissions.')
      );
    }
    next();
  };
};
