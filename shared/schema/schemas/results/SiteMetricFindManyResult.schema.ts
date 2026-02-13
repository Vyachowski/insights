import * as z from 'zod';
export const SiteMetricFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.number().int(),
  siteId: z.number().int(),
  date: z.date(),
  yandexUsers: z.number().int(),
  googleUsers: z.number().int(),
  otherUsers: z.number().int(),
  visitDurationYandexInSec: z.number(),
  visitDurationGoogleInSec: z.number(),
  visitDurationOtherInSec: z.number(),
  bounceYandex: z.number(),
  bounceGoogle: z.number(),
  bounceOther: z.number(),
  leadsYandex: z.number().int(),
  leadsGoogle: z.number().int(),
  leadsOther: z.number().int(),
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