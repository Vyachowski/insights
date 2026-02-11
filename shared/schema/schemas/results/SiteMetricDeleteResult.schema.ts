import * as z from 'zod';
export const SiteMetricDeleteResultSchema = z.nullable(z.object({
  id: z.number().int(),
  site_id: z.number().int(),
  date: z.date(),
  yandex_users: z.number().int(),
  google_users: z.number().int(),
  other_users: z.number().int(),
  visit_duration_yandex_in_sec: z.number(),
  visit_duration_google_in_sec: z.number(),
  visit_duration_other_in_sec: z.number(),
  bounce_yandex: z.number(),
  bounce_google: z.number(),
  bounce_other: z.number(),
  leads_yandex: z.number().int(),
  leads_google: z.number().int(),
  leads_other: z.number().int(),
  site: z.unknown()
}));