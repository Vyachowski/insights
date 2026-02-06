import * as z from "zod";

export const CitySchema = z.object({
  id: z.coerce.number().positive(),
  code: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  population: z.coerce.number().positive(),
});

export const SiteSchema = z.object({
  id: z.coerce.number().positive(),
  city_id: z.coerce.number().positive().min(1),
  name: z.string().min(1).optional(),
  group: z.string().min(1).optional(),
  url: z.string().min(1),
  yandex_counter_id: z.string(),
  google_counter_id: z.string(),
  yandex_tag_manager_id: z.string(),
  google_tag_manager_id: z.string(),
});

export const CallSchema = z.object({
  city_id: z.coerce.number().positive().min(1),
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
});

export const RevenueSchema = z.object({
  city_id: z.preprocess((val) => {
    if (val === "" || val == null) return null;
    return Number(val);
  }, z.number().nullable()),
  date: z.coerce.date(),
  amount: z.coerce.number().positive(),
});

export const ExpenseSchema = z.object({
  city_id: z.coerce.number().int().positive().nullable(),
  date: z.coerce.date(),
  amount: z.coerce.number().positive(),
  type: z.string().min(1),
  comment: z.string().optional(),
});

export const SiteMetricSchema = z.object({
  site_id: z.coerce.number().int().positive(),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
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
