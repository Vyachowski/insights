import * as z from 'zod';
export const SiteMetricFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.number().int(),
  site_id: z.number().int(),
  date: z.date(),
  yandex_users: z.number().int(),
  google_users: z.number().int(),
  other_users: z.number().int(),
  visit_duration_yandex_in_sec: z.number().int(),
  visit_duration_google_in_sec: z.number().int(),
  visit_duration_other_in_sec: z.number().int(),
  bounce_yandex: z.number(),
  bounce_google: z.number(),
  bounce_other: z.number(),
  leads_yandex: z.number().int(),
  leads_google: z.number().int(),
  leads_other: z.number().int(),
  site: z.unknown()
})),
  pagination: z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
  hasNext: z.boolean(),
  hasPrev: z.boolean()
})
});