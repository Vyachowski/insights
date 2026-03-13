import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/prisma/generated/prisma/client';

const pool = new PrismaPg({ connectionString: process.env.DB_URL });
const prisma = new PrismaClient({ adapter: pool });

export async function checkDatabaseConnection(): Promise<void> {
  await prisma.$connect();
  await prisma.$queryRaw`SELECT 1`;
}
