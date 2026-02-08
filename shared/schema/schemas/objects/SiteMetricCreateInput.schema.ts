import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteCreateNestedOneWithoutMetricsInputObjectSchema as SiteCreateNestedOneWithoutMetricsInputObjectSchema } from './SiteCreateNestedOneWithoutMetricsInput.schema'

const makeSchema = () => z.object({
  date: z.coerce.date(),
  yandex_users: z.number().int().optional(),
  google_users: z.number().int().optional(),
  other_users: z.number().int().optional(),
  visit_duration_yandex_in_sec: z.number().int().optional(),
  visit_duration_google_in_sec: z.number().int().optional(),
  visit_duration_other_in_sec: z.number().int().optional(),
  bounce_yandex: z.number().optional(),
  bounce_google: z.number().optional(),
  bounce_other: z.number().optional(),
  leads_yandex: z.number().int().optional(),
  leads_google: z.number().int().optional(),
  leads_other: z.number().int().optional(),
  site: z.lazy(() => SiteCreateNestedOneWithoutMetricsInputObjectSchema)
}).strict();
export const SiteMetricCreateInputObjectSchema: z.ZodType<Prisma.SiteMetricCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteMetricCreateInput>;
export const SiteMetricCreateInputObjectZodSchema = makeSchema();
