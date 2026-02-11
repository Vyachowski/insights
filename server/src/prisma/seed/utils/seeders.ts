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
import { RoleSchema } from '@shared/schema/schemas';

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

  await prisma.callImport.createMany(validatedCallsData);
}

export async function seedRevenue(revenuePath: string): Promise<void> {
  const revenueData = parseCSV(revenuePath);
  const validatedRevenueData = validateRevenuesData(revenueData);

  await prisma.revenue.createMany({
    data: validatedRevenueData.map(({ city_id, date, amount }) => ({
      city_id: city_id ? city_id : null,
      date: new Date(date),
      amount: amount,
    })),
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
    data: validatedExpensesData.map(({ city_id, date, amount }) => ({
      city_id: city_id ? city_id : null,
      date: new Date(date),
      amount,
    })),
    skipDuplicates: true,
  });
}

export async function seedUsers(): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const userEmail = process.env.USER_EMAIL;
  const userPassword = process.env.USER_PASSWORD;

  if (!adminEmail || !adminPassword || !userEmail || !userPassword) {
    throw new Error(
      '❌ ADMIN_EMAIL, ADMIN_PASSWORD, USER_EMAIL and USER_PASSWORD must be set in environment variables',
    );
  }

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  const existingUser = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!existingAdmin) {
    const hashedAdminPassword = await argon2.hash(adminPassword);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedAdminPassword,
        role: RoleSchema.enum.ADMIN,
        firstName: 'Вячеслав',
      },
    });
    console.log(`✅ Admin user created with email: ${adminEmail}`);
  } else {
    console.log(
      `ℹ️ Admin user with email ${adminEmail} already exists. Skipping.`,
    );
  }

  if (!existingUser) {
    const hashedUserPassword = await argon2.hash(userPassword);
    await prisma.user.create({
      data: {
        email: userEmail,
        password: hashedUserPassword,
        firstName: 'Сергей',
      },
    });
    console.log(`✅ Regular user created with email: ${userEmail}`);
  } else {
    console.log(
      `ℹ️ Regular user with email ${userEmail} already exists. Skipping.`,
    );
  }
}
