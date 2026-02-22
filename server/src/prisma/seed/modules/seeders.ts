import { parseCSV } from './parsers';
import {
  validateCallsData,
  validateCitiesData,
  validateExpensesData,
  validateRevenuesData,
  validateSiteMetrics,
  validateSitesData,
} from './validators';

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'generated/prisma/client';
import {
  normalizeCallImportData,
  normalizeCities,
  normalizeExpenses,
  normalizeRevenue,
  normalizeSiteMetrics,
  normalizeSites,
} from './normalizers';
import { createUsers } from './creators';

const pool = new PrismaPg({ connectionString: process.env.DB_URL });
const prisma = new PrismaClient({ adapter: pool });

export async function seedCities(citiesPath: string) {
  const citiesImport = parseCSV(citiesPath);
  const normalizedCities = normalizeCities(citiesImport);
  const validatedCities = validateCitiesData(normalizedCities);

  await prisma.city.createMany(validatedCities);
}

export async function seedSites(sitesPath: string) {
  const sitesImport = parseCSV(sitesPath);
  const normalizedSites = normalizeSites(sitesImport);
  const validatedSites = validateSitesData(normalizedSites);

  await prisma.site.createMany(validatedSites);
}

export async function seedCalls(callsPath: string) {
  const callsImport = parseCSV(callsPath);
  const normalizedCalls = normalizeCallImportData(callsImport);
  const validatedCalls = validateCallsData(normalizedCalls);

  await prisma.callImport.createMany(validatedCalls);
}

export async function seedRevenue(revenuePath: string) {
  const revenueImport = parseCSV(revenuePath);
  const normalizedRevenue = normalizeRevenue(revenueImport);
  const validatedRevenue = validateRevenuesData(normalizedRevenue);

  await prisma.revenue.createMany(validatedRevenue);
}

export async function seedExpenses(expensesPath: string) {
  const expensesData = parseCSV(expensesPath);
  const normalizedExpenses = normalizeExpenses(expensesData);
  const validatedExpensesData = validateExpensesData(normalizedExpenses);

  await prisma.expense.createMany(validatedExpensesData);
}

export async function seedSiteMetrics(siteMetricsPath: string) {
  const siteMetricsData = parseCSV(siteMetricsPath);
  const normalizedSiteMetrics = normalizeSiteMetrics(siteMetricsData);
  const validatedSiteMetrics = validateSiteMetrics(normalizedSiteMetrics);

  await prisma.siteMetric.createMany(validatedSiteMetrics);
}

export async function seedUsers() {
  const createdUsers = await createUsers();

  await prisma.user.createMany({
    data: createdUsers,
  });
}
