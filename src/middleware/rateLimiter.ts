import { NextFunction, Request, Response } from 'express';
import redis from '../utils/redis';
import { TooManyRequestsError } from './AppError';

const RATE_LIMIT = 10;
const TIME_WINDOW = 60;
export const rateLimit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ip = req.ip; // หรือใช้ `req.user` ถ้าคุณใช้ JWT หรือ Authentication อื่น
  const key = `rate_limit:${ip}`;

  // ตรวจสอบว่าเคยมีการบันทึกจำนวน request ของ IP นี้หรือไม่
  const currentRequestCount = await redis.get(key);

  if (currentRequestCount && parseInt(currentRequestCount) >= RATE_LIMIT) {
    // ถ้าจำนวน request เกิน limit
    return next(
      new TooManyRequestsError('Too many requests. Please try again later.')
    );
  }

  // เพิ่มจำนวนการร้องขอของ IP นี้
  await redis
    .multi()
    .incr(key) // เพิ่มค่า count
    .expire(key, TIME_WINDOW) // ตั้งเวลา expiration (หมดอายุหลังจาก 1 นาที)
    .exec();

  next();
};
