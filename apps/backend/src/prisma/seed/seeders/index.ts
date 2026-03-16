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
import { ImportResult, SiteWithCity } from '../types';

export async function seedUsers(
  users: ReturnType<typeof createUsers>,
): Promise<ImportResult> {
  const data = [users.admin, users.user];
  const total = data.length;

  const result = await prisma.user.createMany({
    data: data,
    skipDuplicates: true,
  });

  return {
    inserted: result.count,
    skipped: total - result.count,
    errors: [],
    data: null,
  };
}

export async function seedCities(
  cities: ReturnType<typeof validateCitiesData>,
): Promise<ImportResult> {
  const total = Array.isArray(cities.data) ? cities.data.length : 1;
  const result = await prisma.city.createMany(cities);

  return {
    inserted: result.count,
    skipped: total - result.count,
    errors: [],
    data: null,
  };
}

export async function seedSites(
  sites: ReturnType<typeof validateSitesData>,
): Promise<ImportResult<SiteWithCity[]>> {
  const total = Array.isArray(sites.data) ? sites.data.length : 1;
  const result = await prisma.site.createMany(sites);

  const data = await prisma.site.findMany({
    select: {
      id: true,
      city: { select: { name: true } },
    },
  });

  return {
    inserted: result.count,
    skipped: total - result.count,
    errors: [],
    data,
  };
}

export async function seedCalls(
  callImport: ReturnType<typeof validateCallImportData>,
): Promise<ImportResult> {
  const total = Array.isArray(callImport.data) ? callImport.data.length : 1;
  const result = await prisma.callImport.createMany(callImport);

  return {
    inserted: result.count,
    skipped: total - result.count,
    errors: [],
    data: null,
  };
}

export async function seedRevenue(
  revenue: ReturnType<typeof validateRevenuesData>,
): Promise<ImportResult> {
  const total = Array.isArray(revenue.data) ? revenue.data.length : 1;
  const result = await prisma.revenue.createMany(revenue);

  return {
    inserted: result.count,
    skipped: total - result.count,
    errors: [],
    data: null,
  };
}

export async function seedExpenses(
  expenses: ReturnType<typeof validateExpensesData>,
): Promise<ImportResult> {
  const total = Array.isArray(expenses.data) ? expenses.data.length : 1;
  const result = await prisma.expense.createMany(expenses);

  return {
    inserted: result.count,
    skipped: total - result.count,
    errors: [],
    data: null,
  };
}

export async function seedSiteMetrics(
  metrics: ReturnType<typeof validateSiteMetricsData>,
): Promise<ImportResult> {
  const total = Array.isArray(metrics.data) ? metrics.data.length : 1;
  const result = await prisma.siteMetric.createMany(metrics);

  return {
    inserted: result.count,
    skipped: total - result.count,
    errors: [],
    data: null,
  };
}
