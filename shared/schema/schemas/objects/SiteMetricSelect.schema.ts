import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteArgsObjectSchema as SiteArgsObjectSchema } from './SiteArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  site_id: z.boolean().optional(),
  date: z.boolean().optional(),
  yandex_users: z.boolean().optional(),
  google_users: z.boolean().optional(),
  other_users: z.boolean().optional(),
  visit_duration_yandex_in_sec: z.boolean().optional(),
  visit_duration_google_in_sec: z.boolean().optional(),
  visit_duration_other_in_sec: z.boolean().optional(),
  bounce_yandex: z.boolean().optional(),
  bounce_google: z.boolean().optional(),
  bounce_other: z.boolean().optional(),
  leads_yandex: z.boolean().optional(),
  leads_google: z.boolean().optional(),
  leads_other: z.boolean().optional(),
  site: z.union([z.boolean(), z.lazy(() => SiteArgsObjectSchema)]).optional()
}).strict();
export const SiteMetricSelectObjectSchema: z.ZodType<Prisma.SiteMetricSelect> = makeSchema() as unknown as z.ZodType<Prisma.SiteMetricSelect>;
export const SiteMetricSelectObjectZodSchema = makeSchema();
