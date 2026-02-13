import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteCreateNestedOneWithoutMetricsInputObjectSchema as SiteCreateNestedOneWithoutMetricsInputObjectSchema } from './SiteCreateNestedOneWithoutMetricsInput.schema'

const makeSchema = () => z.object({
  date: z.coerce.date(),
  yandexUsers: z.number().int().optional(),
  googleUsers: z.number().int().optional(),
  otherUsers: z.number().int().optional(),
  visitDurationYandexInSec: z.number().optional(),
  visitDurationGoogleInSec: z.number().optional(),
  visitDurationOtherInSec: z.number().optional(),
  bounceYandex: z.number().optional(),
  bounceGoogle: z.number().optional(),
  bounceOther: z.number().optional(),
  leadsYandex: z.number().int().optional(),
  leadsGoogle: z.number().int().optional(),
  leadsOther: z.number().int().optional(),
  site: z.lazy(() => SiteCreateNestedOneWithoutMetricsInputObjectSchema)
}).strict();
export const SiteMetricCreateInputObjectSchema: z.ZodType<Prisma.SiteMetricCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteMetricCreateInput>;
export const SiteMetricCreateInputObjectZodSchema = makeSchema();
