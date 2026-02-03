import fs from 'fs/promises';

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'generated/prisma/client';

const pool = new PrismaPg({ connectionString: process.env.DB_URL });
const prisma = new PrismaClient({ adapter: pool });

export async function checkFilesExistence(paths: string[]): Promise<void> {
  await Promise.all(paths.map((p) => fs.access(p)));
}

export async function checkDatabaseConnection(): Promise<void> {
  await prisma.$connect();
  await prisma.$queryRaw`SELECT 1`;
}
