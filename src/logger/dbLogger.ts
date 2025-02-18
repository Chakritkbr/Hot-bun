import logger from './logger';
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'event', level: 'warn' },
    { emit: 'event', level: 'error' },
  ],
});

prisma.$on('query', (event: Prisma.QueryEvent) => {
  logger.info(`[DB QUERY] ${event.query}`);
});

prisma.$on('warn', (event: Prisma.LogEvent) => {
  logger.warn(`[DB WARN] ${event.message}`);
});

prisma.$on('error', (event: Prisma.LogEvent) => {
  logger.error(`[DB ERROR] ${event.message}`);
});

export default prisma;
