import {
  CityCreateManySchema,
  SiteCreateManySchema,
  CallImportCreateManyZodSchema,
  RevenueCreateManyZodSchema,
  ExpenseCreateManyZodSchema,
  SiteMetricCreateManyZodSchema,
} from '../../generated/schemas';
import {
  normalizeCalls,
  normalizeCities,
  normalizeExpenses,
  normalizeRevenue,
  normalizeSiteMetrics,
  normalizeSites,
} from '../normalizers';

export function validateCitiesData(
  citiesData: ReturnType<typeof normalizeCities>,
) {
  if (citiesData.length < 1) throw new Error('Нет данных сайта для валидации.');

  return CityCreateManySchema.parse({
    data: citiesData,
    skipDuplicates: true,
  });
}

export function validateSitesData(
  sitesData: ReturnType<typeof normalizeSites>,
) {
  if (sitesData.length < 1) throw new Error('Нет данных сайта для валидации.');

  return SiteCreateManySchema.parse({
    data: sitesData,
    skipDuplicates: true,
  });
}

export function validateCallImportData(
  callsData: ReturnType<typeof normalizeCalls>,
) {
  if (callsData.length < 1) {
    throw new Error('Нет данных звонков для валидации.');
  }

  return CallImportCreateManyZodSchema.parse({
    data: callsData,
    skipDuplicates: true,
  });
}

export function validateRevenuesData(
  revenuesData: ReturnType<typeof normalizeRevenue>,
) {
  if (revenuesData.length < 1) {
    throw new Error('Нет данных доходов для валидации.');
  }

  return RevenueCreateManyZodSchema.parse({
    data: revenuesData,
    skipDuplicates: true,
  });
}

export function validateExpensesData(
  expensesData: ReturnType<typeof normalizeExpenses>,
) {
  if (expensesData.length < 1) {
    throw new Error('Нет данных расходов для валидации.');
  }

  return ExpenseCreateManyZodSchema.parse({
    data: expensesData,
    skipDuplicates: true,
  });
}

export function validateSiteMetricsData(
  siteMetricsData: ReturnType<typeof normalizeSiteMetrics>,
) {
  if (siteMetricsData.length < 1) {
    throw new Error('Нет данных метрик сайта для валидации.');
  }

  return SiteMetricCreateManyZodSchema.parse({
    data: siteMetricsData,
    skipDuplicates: true,
  });
}
