import "dotenv/config";

import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'

const { DB_URL } = process.env;

const adapter = new PrismaPg({ DB_URL })
const prisma = new PrismaClient({ adapter })

export { prisma }