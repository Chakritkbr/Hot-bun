import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const port = 8080;

app.get('/', async (req: Request, res: Response) => {
  // ตัวอย่างการดึงข้อมูลจากฐานข้อมูล
  const users = await prisma.user.findMany();
  res.json(users);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port} 1231`);
});
