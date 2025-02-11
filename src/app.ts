import express, { Application } from 'express';
import dotenv from 'dotenv';
import prisma from './db';

dotenv.config({ path: './.env' });
const app: Application = express();

app.use(express.json());
app.set('prisma', prisma);

export default app;
