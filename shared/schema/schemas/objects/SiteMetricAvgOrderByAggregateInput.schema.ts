import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  site_id: SortOrderSchema.optional(),
  yandex_users: SortOrderSchema.optional(),
  google_users: SortOrderSchema.optional(),
  other_users: SortOrderSchema.optional(),
  visit_duration_yandex_in_sec: SortOrderSchema.optional(),
  visit_duration_google_in_sec: SortOrderSchema.optional(),
  visit_duration_other_in_sec: SortOrderSchema.optional(),
  bounce_yandex: SortOrderSchema.optional(),
  bounce_google: SortOrderSchema.optional(),
  bounce_other: SortOrderSchema.optional(),
  leads_yandex: SortOrderSchema.optional(),
  leads_google: SortOrderSchema.optional(),
  leads_other: SortOrderSchema.optional()
}).strict();
export const SiteMetricAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.SiteMetricAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteMetricAvgOrderByAggregateInput>;
export const SiteMetricAvgOrderByAggregateInputObjectZodSchema = makeSchema();
