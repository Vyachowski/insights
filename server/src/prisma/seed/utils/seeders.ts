import { parseCSV } from './parsers';
import {
  validateCallsData,
  validateCitiesData,
  validateRevenuesData,
  validateSiteMetricsData,
  validateSitesData,
} from './validators';
import * as argon2 from 'argon2';

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'generated/prisma/client';

const pool = new PrismaPg({ connectionString: process.env.DB_URL });
const prisma = new PrismaClient({ adapter: pool });

export async function seedCities(citiesPath: string): Promise<void> {
  const citiesData = parseCSV(citiesPath);
  const validatedCitiesData = validateCitiesData(citiesData);

  for (const city of validatedCitiesData) {
    await prisma.city.upsert({
      where: { id: city.id },
      update: city,
      create: city,
    });
  }
}

export async function seedSites(sitesPath: string): Promise<void> {
  const sitesData = parseCSV(sitesPath);
  const validatedSitesData = validateSitesData(sitesData);

  await prisma.site.createMany({
    data: validatedSitesData,
    skipDuplicates: true,
  });
}

export async function seedCalls(callsPath: string): Promise<void> {
  const callsData = parseCSV(callsPath);
  const validatedCallsData = validateCallsData(callsData);

  await prisma.call.createMany({
    data: validatedCallsData,
    skipDuplicates: true,
  });
}

export async function seedRevenue(revenuePath: string): Promise<void> {
  const revenueData = parseCSV(revenuePath);
  const validatedRevenueData = validateRevenuesData(revenueData);

  await prisma.revenue.createMany({
    data: validatedRevenueData,
    skipDuplicates: true,
  });
}

export async function seedSiteMetrics(siteMetricsPath: string): Promise<void> {
  const siteMetricsData = parseCSV(siteMetricsPath);
  const validatedMetricsData = validateSiteMetricsData(siteMetricsData);

  const BATCH_SIZE = 1000;
  const totalMetrics = validatedMetricsData.length;

  for (let i = 0; i < totalMetrics; i += BATCH_SIZE) {
    const batch = validatedMetricsData.slice(i, i + BATCH_SIZE);

    await prisma.siteMetric.createMany({
      data: batch,
      skipDuplicates: true,
    });
  }
}

export async function seedExpenses(expensesPath: string): Promise<void> {
  const expensesData = parseCSV(expensesPath);
  const validatedExpensesData = validateRevenuesData(expensesData);

  await prisma.revenue.createMany({
    data: validatedExpensesData,
    skipDuplicates: true,
  });
}

export const seedAdmin = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error(
      '❌ ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment variables',
    );
  }

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log(
      `ℹ️  Admin user with email ${adminEmail} already exists. Skipping.`,
    );
    return;
  }

  const hashedPassword = await argon2.hash(adminPassword);

  await prisma.user.create({
    data: {
      email: adminEmail,
      password: hashedPassword,
      isAdmin: true,
      firstName: 'Admin',
      isActive: true,
    },
  });

  console.log(`✅ Admin user created with email: ${adminEmail}`);
};
