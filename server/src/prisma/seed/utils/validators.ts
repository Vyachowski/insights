import {
  CallImportCreateManyZodSchema,
  CityCreateManySchema,
  ExpenseCreateManyZodSchema,
  RevenueCreateManyZodSchema,
  SiteCreateManySchema,
  SiteMetricCreateManyZodSchema,
} from '@shared/schema/schemas';

export function validateCitiesData(
  citiesData: Record<string, string | number>[],
) {
  if (citiesData.length < 1) throw new Error('Нет данных сайта для валидации.');

  return CityCreateManySchema.parse({
    data: citiesData,
    skipDuplicates: true,
  });
}

export function validateSitesData(
  sitesData: Record<string, string | number>[],
) {
  if (sitesData.length < 1) throw new Error('Нет данных сайта для валидации.');

  return SiteCreateManySchema.parse({
    data: sitesData,
    skipDuplicates: true,
  });
}

export function validateCallsData(
  callsData: Record<string, string | number>[],
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
  revenuesData: Record<string, string | null | Date | number>[],
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
  expensesData: Record<string, string | number | Date | null>[],
) {
  if (expensesData.length < 1) {
    throw new Error('Нет данных расходов для валидации.');
  }

  return ExpenseCreateManyZodSchema.parse({
    data: expensesData,
    skipDuplicates: true,
  });
}

export function validateSiteMetrics(
  siteMetricsData: Record<string, string | number | Date | null>[],
) {
  if (siteMetricsData.length < 1) {
    throw new Error('Нет данных метрик сайта для валидации.');
  }

  return SiteMetricCreateManyZodSchema.parse({
    data: siteMetricsData,
    skipDuplicates: true,
  });
}
