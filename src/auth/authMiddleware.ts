import { NextFunction, Request, Response } from 'express';
import { UserInterface, verifyToken } from './authUtils';

export interface CustomUserRequest extends Request {
  user?: UserInterface;
}

export const authenticateToken = (
  req: CustomUserRequest,
  res: Response,
  next: NextFunction
): void => {
  // Returning void, don't return the Response object
  const authHeader = req.headers['authorization'];
  const token =
    authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null;

  if (!token) {
    res.status(401).json({ message: 'Token is required' });
    return; // Exit after sending the response
  }

  try {
    const payload = verifyToken(token);
    if (!payload) {
      res.status(403).json({ message: 'Invalid or expired token.' });
      return; // Exit after sending the response
    }

    req.user = payload as UserInterface;
    next(); // Continue to the next middleware or route handler
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
