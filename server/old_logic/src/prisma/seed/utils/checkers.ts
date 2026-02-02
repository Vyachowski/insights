import fs from 'fs/promises'
import { prisma } from "../../../lib/prisma"

export async function checkFilesExistence (paths: string[]): Promise<void> {
  await Promise.all(paths.map(p => fs.access(p)));
}

export async function checkDatabaseConnection(): Promise<void> {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
}