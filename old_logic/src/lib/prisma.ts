import "dotenv/config";

import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'

const { DB_URL: connectionString } = process.env;

const adapter = new PrismaPg({  connectionString })
const prisma = new PrismaClient({ adapter })

export { prisma }