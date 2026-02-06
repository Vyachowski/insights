import {
  CitySchema,
  SiteSchema,
  CallSchema,
  RevenueSchema,
  ExpenseSchema,
  SiteMetricSchema,
} from "../../schemas";
import type { City, Site, SiteMetric } from "../../types";

export const validateCitiesData = (
  citiesData: { [k: string]: string | undefined }[],
): City[] => {
  if (citiesData.length < 1)
    throw new Error("Нет данных города для валидации.");

  return citiesData.map((city) => CitySchema.parse(city));
};

export const validateSitesData = (
  sitesData: { [k: string]: string | undefined }[],
): Site[] => {
  if (sitesData.length < 1) throw new Error("Нет данных сайта для валидации.");

  return sitesData.map((site) => SiteSchema.parse(site));
};

export const validateCallsData = (
  callsData: { [k: string]: string | undefined }[],
) => {
  if (callsData.length < 1) {
    throw new Error("Нет данных звонков для валидации.");
  }

  return callsData.map((call) => CallSchema.parse(call));
};

export const validateRevenuesData = (
  revenuesData: { [k: string]: string | undefined }[],
) => {
  if (revenuesData.length < 1) {
    throw new Error("Нет данных доходов для валидации.");
  }

  return revenuesData.map((revenue) => RevenueSchema.parse(revenue));
};

export const validateExpensesData = (
  expensesData: { [k: string]: string | undefined }[],
) => {
  if (expensesData.length < 1) {
    throw new Error("Нет данных расходов для валидации.");
  }

  return expensesData.map((expense) => ExpenseSchema.parse(expense));
};

export function validateSiteMetricsData(
  siteMetricData: { [k: string]: string | undefined }[],
): SiteMetric[] {
  const validated: SiteMetric[] = [];
  const errors: any[] = [];

  for (let i = 0; i < siteMetricData.length; i++) {
    const result = SiteMetricSchema.safeParse(siteMetricData[i]);

    if (result.success) {
      // Преобразуем дату в ISO формат
      const metric = {
        ...result.data,
        date: new Date(result.data.date).toISOString(),
      };

      validated.push(metric);
    } else {
      errors.push({
        row: i + 1,
        data: siteMetricData[i],
        issues: result.error.issues,
      });
    }
  }

  if (errors.length > 0) {
    console.warn(`⚠️  Найдено ${errors.length} ошибок валидации в метриках:`);
    errors.slice(0, 5).forEach((err) => {
      console.warn(`  Строка ${err.row}:`, err.issues);
    });
    if (errors.length > 5) {
      console.warn(`  ... и еще ${errors.length - 5} ошибок`);
    }
  }

  console.log(
    `✓ Валидировано метрик: ${validated.length} из ${siteMetricData.length}`,
  );

  return validated;
}
