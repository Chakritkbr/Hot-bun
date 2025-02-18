// errorHandler.ts
import { NextFunction, Request, Response } from 'express';
import { AppError } from './AppError';
import logger from '../logger/logger';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error(`[ERROR] ${req.method} ${req.url} - ${err.message}`);

  if (err instanceof AppError) {
    // ถ้าเป็น instance ของ AppError ให้ใช้ statusCode ที่กำหนด
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message || 'Something went wrong',
    });
    return;
  }

  // ถ้าไม่ใช่ AppError จะส่ง 500
  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
};
