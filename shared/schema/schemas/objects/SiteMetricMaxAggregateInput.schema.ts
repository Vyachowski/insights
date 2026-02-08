import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  site_id: z.literal(true).optional(),
  date: z.literal(true).optional(),
  yandex_users: z.literal(true).optional(),
  google_users: z.literal(true).optional(),
  other_users: z.literal(true).optional(),
  visit_duration_yandex_in_sec: z.literal(true).optional(),
  visit_duration_google_in_sec: z.literal(true).optional(),
  visit_duration_other_in_sec: z.literal(true).optional(),
  bounce_yandex: z.literal(true).optional(),
  bounce_google: z.literal(true).optional(),
  bounce_other: z.literal(true).optional(),
  leads_yandex: z.literal(true).optional(),
  leads_google: z.literal(true).optional(),
  leads_other: z.literal(true).optional()
}).strict();
export const SiteMetricMaxAggregateInputObjectSchema: z.ZodType<Prisma.SiteMetricMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.SiteMetricMaxAggregateInputType>;
export const SiteMetricMaxAggregateInputObjectZodSchema = makeSchema();
