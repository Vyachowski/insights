import { CallImportCreateManyZodSchema } from '@shared/schema/schemas';
import * as z from 'zod';

// Schemas
const City = z.object({
  id: z.coerce.number().positive(),
  code: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  population: z.coerce.number().positive(),
});

type City = z.infer<typeof City>;

const Site = z.object({
  city_id: z.coerce.number().positive().min(1),
  name: z.string().min(1),
  url: z.string().min(1),
  yandex_counter_id: z.string(),
  google_counter_id: z.string(),
  yandex_tag_manager_id: z.string(),
  google_tag_manager_id: z.string(),
});

type Site = z.infer<typeof Site>;

// const Call = z.object({
//   city_id: z.coerce.number().positive().min(1),
//   date_time: z.coerce.date(),
//   caller_number: z.string().min(1),
//   region: z.string().min(1),
//   call_order: z.coerce.number().int().positive(),
//   class: z.string().nullable(),
//   number_name: z.string().nullable(),
//   project: z.string().min(1),
//   duration_in_sec: z.coerce.number().int().nonnegative().nullable(),
//   comment: z.string().nullable(),
//   redirect_number: z.string().nullable(),
// });

// type Call = z.infer<typeof Call>;

const Revenue = z.object({
  city_id: z.preprocess((val) => {
    if (val === '' || val == null) return null;
    return Number(val);
  }, z.number().nullable()),
  date: z.coerce.date(),
  amount: z.coerce.number().positive(),
});

type Revenue = z.infer<typeof Revenue>;

const Expense = z.object({
  city_id: z.coerce.number().int().positive().nullable(),
  date: z.coerce.date(),
  amount: z.coerce.number().positive(),
  type: z.string().min(1),
  comment: z.string().optional(),
});

type Expense = z.infer<typeof Expense>;

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

// Validators
export const validateCitiesData = (
  citiesData: { [k: string]: string | undefined }[],
) => {
  if (citiesData.length < 1)
    throw new Error('Нет данных города для валидации.');

  return citiesData.map((city) => City.parse(city));
};

export const validateSitesData = (
  sitesData: { [k: string]: string | undefined }[],
) => {
  if (sitesData.length < 1) throw new Error('Нет данных сайта для валидации.');

  return sitesData.map((site) => Site.parse(site));
};

// === Calls Import
function normalizeCallImportData(
  callsImportData: { [k: string]: string | undefined }[],
) {
  return callsImportData.map((call) => ({
    ...call,
    site_id: Number(call.site_id),
    call_number: Number(call.call_number),
    billsec: Number(call.billsec),
  }));
}

export const validateCallsData = (
  callsData: { [k: string]: string | undefined }[],
) => {
  if (callsData.length < 1) {
    throw new Error('Нет данных звонков для валидации.');
  }

  const normalizedCalls = normalizeCallImportData(callsData);

  return CallImportCreateManyZodSchema.parse({
    data: normalizedCalls,
    skipDuplicates: true,
  });
};

export const validateRevenuesData = (
  revenuesData: { [k: string]: string | undefined }[],
) => {
  if (revenuesData.length < 1) {
    throw new Error('Нет данных доходов для валидации.');
  }

  return revenuesData.map((revenue) => Revenue.parse(revenue));
};

export const validateExpensesData = (
  expensesData: { [k: string]: string | undefined }[],
) => {
  if (expensesData.length < 1) {
    throw new Error('Нет данных расходов для валидации.');
  }

  return expensesData.map((expense) => Expense.parse(expense));
};

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
