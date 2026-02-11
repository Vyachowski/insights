import {
  CallImportCreateManyZodSchema,
  CityCreateManySchema,
  ExpenseCreateManyZodSchema,
  RevenueCreateManyZodSchema,
  SiteCreateManySchema,
} from '@shared/schema/schemas';
import * as z from 'zod';

// Schemas
const SiteMetric = z.object({
  site_id: z.coerce.number().int().positive(),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  yandex_users: z.coerce.number().int().nonnegative().default(0),
  google_users: z.coerce.number().int().nonnegative().default(0),
  other_users: z.coerce.number().int().nonnegative().default(0),
  visit_duration_yandex_in_sec: z.coerce.number().nonnegative().default(0),
  visit_duration_google_in_sec: z.coerce.number().nonnegative().default(0),
  visit_duration_other_in_sec: z.coerce.number().nonnegative().default(0),
  bounce_yandex: z.coerce.number().nonnegative().default(0),
  bounce_google: z.coerce.number().nonnegative().default(0),
  bounce_other: z.coerce.number().nonnegative().default(0),
  leads_yandex: z.coerce.number().int().nonnegative().default(0),
  leads_google: z.coerce.number().int().nonnegative().default(0),
  leads_other: z.coerce.number().int().nonnegative().default(0),
});

type SiteMetric = z.infer<typeof SiteMetric>;

export const validateCitiesData = (
  sitesData: Record<string, string | number>[],
) => {
  if (sitesData.length < 1) throw new Error('Нет данных сайта для валидации.');

  return CityCreateManySchema.parse({
    data: sitesData,
    skipDuplicates: true,
  });
};

export const validateSitesData = (
  sitesData: Record<string, string | number>[],
) => {
  if (sitesData.length < 1) throw new Error('Нет данных сайта для валидации.');

  return SiteCreateManySchema.parse({
    data: sitesData,
    skipDuplicates: true,
  });
};

export const validateCallsData = (
  callsData: Record<string, string | number>[],
) => {
  if (callsData.length < 1) {
    throw new Error('Нет данных звонков для валидации.');
  }

  return CallImportCreateManyZodSchema.parse({
    data: callsData,
    skipDuplicates: true,
  });
};

export const validateRevenuesData = (
  revenuesData: Record<string, string | null | Date | number>[],
) => {
  if (revenuesData.length < 1) {
    throw new Error('Нет данных доходов для валидации.');
  }

  return RevenueCreateManyZodSchema.parse({
    data: revenuesData,
    skipDuplicates: true,
  });
};

export const validateExpensesData = (
  expensesData: Record<string, string | number | Date | null>[],
) => {
  if (expensesData.length < 1) {
    throw new Error('Нет данных доходов для валидации.');
  }

  return ExpenseCreateManyZodSchema.parse({
    data: expensesData,
    skipDuplicates: true,
  });
};

// export const validateExpensesData = (
//   expensesData: { [k: string]: string | undefined }[],
// ) => {
//   if (expensesData.length < 1) {
//     throw new Error('Нет данных расходов для валидации.');
//   }

//   return expensesData.map((expense) => Expense.parse(expense));
// };

export function validateSiteMetricsData(
  siteMetricData: { [k: string]: string | undefined }[],
): SiteMetric[] {
  const validated: SiteMetric[] = [];
  const errors: Array<{
    row: number;
    data: { [k: string]: string | undefined };
    issues: z.core.$ZodIssue[];
  }> = [];

  for (let i = 0; i < siteMetricData.length; i++) {
    const result = SiteMetric.safeParse(siteMetricData[i]);

    if (result.success) {
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
