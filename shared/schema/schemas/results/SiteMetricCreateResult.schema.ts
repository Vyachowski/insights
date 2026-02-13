import * as z from 'zod';
export const SiteMetricCreateResultSchema = z.object({
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
});