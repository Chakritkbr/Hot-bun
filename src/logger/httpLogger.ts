import { NextFunction, Request, Response } from 'express';
import logger from './logger';
import { CustomUserRequest } from '../auth/authMiddleware';

const httpLogger = (
  req: CustomUserRequest,
  res: Response,
  next: NextFunction
) => {
  logger.info(`[HTTP] ${req.method} ${req.url} - ${req.ip}`);
  next();
};

export default httpLogger;
