import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SiteMetricCountOrderByAggregateInputObjectSchema as SiteMetricCountOrderByAggregateInputObjectSchema } from './SiteMetricCountOrderByAggregateInput.schema';
import { SiteMetricAvgOrderByAggregateInputObjectSchema as SiteMetricAvgOrderByAggregateInputObjectSchema } from './SiteMetricAvgOrderByAggregateInput.schema';
import { SiteMetricMaxOrderByAggregateInputObjectSchema as SiteMetricMaxOrderByAggregateInputObjectSchema } from './SiteMetricMaxOrderByAggregateInput.schema';
import { SiteMetricMinOrderByAggregateInputObjectSchema as SiteMetricMinOrderByAggregateInputObjectSchema } from './SiteMetricMinOrderByAggregateInput.schema';
import { SiteMetricSumOrderByAggregateInputObjectSchema as SiteMetricSumOrderByAggregateInputObjectSchema } from './SiteMetricSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  site_id: SortOrderSchema.optional(),
  date: SortOrderSchema.optional(),
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
  leads_other: SortOrderSchema.optional(),
  _count: z.lazy(() => SiteMetricCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => SiteMetricAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => SiteMetricMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => SiteMetricMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => SiteMetricSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const SiteMetricOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.SiteMetricOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteMetricOrderByWithAggregationInput>;
export const SiteMetricOrderByWithAggregationInputObjectZodSchema = makeSchema();
