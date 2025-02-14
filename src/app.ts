import express, { Application } from 'express';
import dotenv from 'dotenv';
import prisma from './db';
import userRoutes from './users/usersRoute';
import categoriesRoutes from './categories/categoriesRoute';
import productsRoutes from './products/productsRoute';

dotenv.config({ path: './.env' });
const app: Application = express();

app.use(express.json());
app.set('prisma', prisma);

app.use('/auth', userRoutes);
app.use('/api', categoriesRoutes);
app.use('/api', productsRoutes);

export default app;
