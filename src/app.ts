import express, { Application } from 'express';
import dotenv from 'dotenv';
import prisma from './db';
import userRoutes from './users/usersRoute';
import categoriesRoutes from './categories/categoriesRoute';
import productsRoutes from './products/productsRoute';
import cartRoutes from './cart/cartRoute';
import OrderRoutes from './order/orderRoute';
import { errorHandler } from './middleware/errorHandler';
import errorLogger from './logger/errorLogger';
import httpLogger from './logger/httpLogger';
import { rateLimit } from './middleware/rateLimiter';

dotenv.config({ path: './.env' });
const app: Application = express();

app.use(express.json());
app.use(rateLimit);
app.use(httpLogger);
app.use(errorLogger);
app.set('prisma', prisma);

app.use('/auth', userRoutes);
app.use('/api', categoriesRoutes);
app.use('/api', productsRoutes);
app.use('/api', cartRoutes);
app.use('/api', OrderRoutes);

app.use(errorHandler);

export default app;
