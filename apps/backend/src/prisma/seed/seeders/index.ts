import { PrismaClient } from '@/prisma/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import {
  validateCallImportData,
  validateCitiesData,
  validateExpensesData,
  validateRevenuesData,
  validateSiteMetricsData,
  validateSitesData,
} from '../validators';
import { createUsers } from '../creators';

const pool = new PrismaPg({ connectionString: process.env.DB_URL });
const prisma = new PrismaClient({ adapter: pool });

export async function seedUsers(users: ReturnType<typeof createUsers>) {
  await prisma.user.createMany({
    data: [users.admin, users.user],
  });
}

export async function seedCities(
  cities: ReturnType<typeof validateCitiesData>,
) {
  return await prisma.city.createManyAndReturn(cities);
}

export async function seedSites(sites: ReturnType<typeof validateSitesData>) {
  await prisma.site.createMany(sites);
}

export async function seedCalls(
  callImport: ReturnType<typeof validateCallImportData>,
) {
  await prisma.callImport.createMany(callImport);
}

export async function seedRevenue(
  revenue: ReturnType<typeof validateRevenuesData>,
) {
  await prisma.revenue.createMany(revenue);
}

export async function seedExpenses(
  expenses: ReturnType<typeof validateExpensesData>,
) {
  await prisma.expense.createMany(expenses);
}

export async function seedSiteMetrics(
  metrics: ReturnType<typeof validateSiteMetricsData>,
) {
  await prisma.siteMetric.createMany(metrics);
}
