import { prisma } from "../../../lib/prisma";
import { normalizeCallData } from "./normalizers";
import { parseCSV } from "./parsers";
import { validateCallsData, validateCitiesData, validateRevenuesData, validateSiteMetricsData, validateSitesData } from "./validators";

export async function seedCities (citiesPath: string): Promise<void> {
    const citiesData = parseCSV(citiesPath)
    const validatedCitiesData = validateCitiesData(citiesData)

    for (const city of validatedCitiesData) {
        await prisma.city.upsert({
            where: { id: city.id },
            update: city,
            create: city,
        })
    }
}

export async function seedSites (sitesPath: string): Promise<void> {
    const sitesData = parseCSV(sitesPath)
    const validatedSitesData = validateSitesData(sitesData)

    await prisma.site.createMany({
        data: validatedSitesData,
        skipDuplicates: true,
    })
}

export async function seedCalls (callsPath: string): Promise<void> {
    const cities = await prisma.city.findMany()
    const callsData = parseCSV(callsPath)
    const normalizedCalls = normalizeCallData(callsData, cities)
    const validatedCallsData = validateCallsData(normalizedCalls)

    await prisma.call.createMany({
        data: validatedCallsData,
        skipDuplicates: true,
    })
}

export async function seedRevenue (revenuePath: string): Promise<void> {
    const revenueData = parseCSV(revenuePath)
    const validatedRevenueData = validateRevenuesData(revenueData);

    await prisma.revenue.createMany({
        data: validatedRevenueData,
        skipDuplicates: true,
    });
}

export async function seedSiteMetrics (siteMetricsPath: string): Promise<void> {
    const siteMetricsData = parseCSV(siteMetricsPath)
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

export async function seedExpenses (expensesPath: string): Promise<void> {}
