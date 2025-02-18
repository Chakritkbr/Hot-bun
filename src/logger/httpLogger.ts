import { NextFunction, Request, Response } from 'express';
import logger from './logger';
import { CustomUserRequest } from '../auth/authMiddleware';

const httpLogger = (
  req: CustomUserRequest,
  res: Response,
  next: NextFunction
) => {
  const userRole = req.user?.role || 'GUEST';
  console.log(userRole);
  logger.info(
    `[HTTP] ${req.method} ${req.url} - ${req.ip} - User Role: ${userRole}`
  );
  next();
};

export default httpLogger;
