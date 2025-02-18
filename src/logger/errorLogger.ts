import logger from './logger';
import { Request, Response, NextFunction } from 'express';

const errorLogger = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(`[ERROR] ${req.method} ${req.url} - ${err.message}`);
  next(err);
};

export default errorLogger;
