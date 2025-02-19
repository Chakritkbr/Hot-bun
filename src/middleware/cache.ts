import { Request, Response, NextFunction, RequestHandler } from 'express';
import redis from '../utils/redis';

// Redis Cache Middleware
export const cache: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const cacheKey = req.path;
    console.log('middleware-key:' + cacheKey);
    // เช็คว่ามีข้อมูลใน Redis หรือไม่
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      // ถ้ามีข้อมูลใน Redis ส่งข้อมูลจาก cache
      console.log(`Data retrieved from cache for key: ${cacheKey}`);
      res.status(200).json({
        status: 'success',
        message: `Data retrieved from cache for ${cacheKey}`,
        data: JSON.parse(cachedData),
      });
      return;
    }

    // ถ้าไม่มีข้อมูลใน cache ให้ไปที่ controller
    console.log(`No cache found for key: ${cacheKey}`);
    next();
  } catch (error) {
    console.error('Error accessing Redis:', error);
    next(error);
  }
};

export const setCache = async (
  key: string,
  data: any,
  expirationTime: number = 3600
) => {
  try {
    // บันทึกข้อมูลลง Redis พร้อมตั้งเวลา expiration
    await redis.set(key, JSON.stringify(data), 'EX', expirationTime);
    console.log(`Data cached for key: ${key}`);
  } catch (error) {
    console.error('Error setting cache:', error);
  }
};
