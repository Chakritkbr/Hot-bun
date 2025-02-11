import express, { Application } from 'express';
import dotenv from 'dotenv';
import prisma from './db';
import userRoutes from './users/usersRoute';

dotenv.config({ path: './.env' });
const app: Application = express();

app.use(express.json());
app.set('prisma', prisma);

app.use('/auth', userRoutes);

export default app;
