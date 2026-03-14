import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/prisma/generated/prisma/client';

const isProd = process.env['NODE_ENV'] === 'production';
const pool = new PrismaPg({
  connectionString: isProd
    ? process.env.DATABASE_PUBLIC_URL
    : process.env.DATABASE_URL,
  max: 2,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

export const prisma = new PrismaClient({ adapter: pool });
