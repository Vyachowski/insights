import * as z from "zod";

// Schema
const City = z.object({
    city_id: z.number().nullable(),
    code: z.string().min(1),
    slug: z.string().min(1),
    name: z.string().min(1),
    population: z.coerce.number().positive()
})

type City = z.infer<typeof City>;

const Site = z.object({
    city_id: z.number().min(1),
    name: z.string().min(1),
    url: z.string().min(1),
    yandex_counter_id: z.string(),
    google_counter_id: z.string(),
    yandex_tag_manager_id: z.string(),
    google_tag_manager_id: z.string(),
})

type Site = z.infer<typeof Site>;

const SiteMetric = z.object({
  site_id: z.number().min(1),
  date: z.coerce.date(),
  yandex_users: z.coerce.number().int().nonnegative().optional(),
  google_users: z.coerce.number().int().nonnegative().optional(),
  visit_duration_yandex_in_sec: z.coerce.number().int().nonnegative().optional(),
  visit_duration_google_in_sec: z.coerce.number().int().nonnegative().optional(),
  bounce_yandex: z.coerce.number().min(0).max(100).optional(),
  bounce_google: z.coerce.number().min(0).max(100).optional(),
  leads_yandex: z.coerce.number().int().nonnegative().optional(),
  leads_google: z.coerce.number().int().nonnegative().optional(),
})

type SiteMetric = z.infer<typeof SiteMetric>;

const Call = z.object({
  city_id: z.number().min(1),
  date_time: z.coerce.date(),
  caller_number: z.string().min(1),
  region: z.string().min(1),
  call_order: z.coerce.number().int().positive(),
  class: z.string().nullable(),
  number_name: z.string().nullable(),
  project: z.string().min(1),
  duration_in_sec: z.coerce.number().int().nonnegative().nullable(),
  comment: z.string().nullable(),
  redirect_number: z.string().nullable(),
})

type Call = z.infer<typeof Call>;

const Revenue = z.object({
  city_id: z.coerce.number().int().positive().nullable(),
  date: z.coerce.date(),
  amount: z.coerce.number().positive(),
})

type Revenue = z.infer<typeof Revenue>;

const Expense = z.object({
  city_id: z.coerce.number().int().positive().nullable(),
  date: z.coerce.date(),
  amount: z.coerce.number().positive(),
  type: z.string().min(1),
  comment: z.string().optional(),
})

type Expense = z.infer<typeof Expense>;

// Validators
export const validateCitiesData = (citiesData: { [k: string]: string | undefined }[]) => {
    if (citiesData.length < 1) throw new Error("Нет данных города для валидации.");

    return citiesData.map(city => City.parse(city))
}

export const validateSitesData = (sitesData: { [k: string]: string | undefined }[]) => {
    if (sitesData.length < 1) throw new Error("Нет данных сайта для валидации.");

    return sitesData.map(city => Site.parse(city))
}

export const validateSiteMetricsData = (
  metricsData: { [k: string]: string | undefined }[]
) => {
  if (metricsData.length < 1) {
    throw new Error("Нет данных метрик сайта для валидации.");
  }

  return metricsData.map(metric => SiteMetric.parse(metric));
};

export const validateCallsData = (
  callsData: { [k: string]: string | undefined }[]
) => {
  if (callsData.length < 1) {
    throw new Error("Нет данных звонков для валидации.");
  }

  return callsData.map(call => Call.parse(call));
};

export const validateRevenuesData = (
  revenuesData: { [k: string]: string | undefined }[]
) => {
  if (revenuesData.length < 1) {
    throw new Error("Нет данных доходов для валидации.");
  }

  return revenuesData.map(revenue => Revenue.parse(revenue));
};

export const validateExpensesData = (
  expensesData: { [k: string]: string | undefined }[]
) => {
  if (expensesData.length < 1) {
    throw new Error("Нет данных расходов для валидации.");
  }

  return expensesData.map(expense => Expense.parse(expense));
};
