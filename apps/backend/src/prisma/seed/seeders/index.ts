import {
  validateCallImportData,
  validateCitiesData,
  validateExpensesData,
  validateRevenuesData,
  validateSiteMetricsData,
  validateSitesData,
} from '../validators';
import { createUsers } from '../creators';
import { prisma } from '../connector';

export async function seedUsers(users: ReturnType<typeof createUsers>) {
  await prisma.user.createMany({
    data: [users.admin, users.user],
    skipDuplicates: true,
  });
}

export async function seedCities(
  cities: ReturnType<typeof validateCitiesData>,
) {
  await prisma.city.createMany(cities);
}

export async function seedSites(sites: ReturnType<typeof validateSitesData>) {
  await prisma.site.createMany(sites);

  return await prisma.site.findMany({
    select: {
      id: true,
      city: {
        select: {
          name: true,
        },
      },
    },
  });
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
