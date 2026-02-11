import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';


const makeSchema = () => z.object({
  id: z.number().int().optional(),
  site_id: z.number().int(),
  date: z.coerce.date(),
  yandex_users: z.number().int().optional(),
  google_users: z.number().int().optional(),
  other_users: z.number().int().optional(),
  visit_duration_yandex_in_sec: z.number().optional(),
  visit_duration_google_in_sec: z.number().optional(),
  visit_duration_other_in_sec: z.number().optional(),
  bounce_yandex: z.number().optional(),
  bounce_google: z.number().optional(),
  bounce_other: z.number().optional(),
  leads_yandex: z.number().int().optional(),
  leads_google: z.number().int().optional(),
  leads_other: z.number().int().optional()
}).strict();
export const SiteMetricCreateManyInputObjectSchema: z.ZodType<Prisma.SiteMetricCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteMetricCreateManyInput>;
export const SiteMetricCreateManyInputObjectZodSchema = makeSchema();
