import { Request, Response, NextFunction, RequestHandler } from 'express';
import redis from '../utils/redis';

export const cacheMiddleware = (expiration: number = 3600) => {
  return (req: Request, res: Response, next: NextFunction) => {
    let cacheKey = req.baseUrl + req.path;
    Object.entries(req.params).forEach(([key, value]) => {
      cacheKey = cacheKey.replace(`:${key}`, value.toString());
    });

    console.log(`Cache Key: ${cacheKey}`);

    redis
      .get(cacheKey)
      .then((cachedData) => {
        if (cachedData) {
          console.log(`Cache hit: ${cacheKey}`);
          return res.json(JSON.parse(cachedData)); // ✅ ส่ง response และจบการทำงาน
        }

        // Monkey Patch `res.json()` เพื่อแคช response
        const originalJson = res.json.bind(res);
        res.json = (data) => {
          if (data && typeof data === 'object' && !(data instanceof Buffer)) {
            redis
              .set(cacheKey, JSON.stringify(data), 'EX', expiration)
              .catch((error) => console.error('Redis cache error:', error));
          }
          return originalJson(data);
        };

        next(); // ✅ ต้องเรียก `next()` ถ้าไม่มี cache
      })
      .catch((error) => {
        console.error('Cache middleware error:', error);
        next(); // ✅ ถ้า error ให้ไป middleware ถัดไป
      });
  };
};

export const cacheClearMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // สร้าง path สำหรับลบ cache จาก req.path โดยเฉพาะ path ที่เกี่ยวข้องกับ API
    const basePath = '/api';
    const pathToClear = `${basePath}${req.path}`;

    // ลบ cache ของ path หลัก เช่น /api/products, /api/categories, /api/cart
    await redis.del(pathToClear);

    // ถ้ามี :id ใน path เช่น /api/products/:id หรือ /api/categories/:id ให้ลบ cache ของ ID นั้นด้วย
    if (req.params.id) {
      await redis.del(`${pathToClear}/${req.params.id}`);
    }

    console.log('Cache cleared for path:', pathToClear);

    next();
  } catch (error) {
    console.error('Error clearing cache:', error);
    next();
  }
};
