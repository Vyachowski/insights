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
  siteId: SortOrderSchema.optional(),
  date: SortOrderSchema.optional(),
  yandexUsers: SortOrderSchema.optional(),
  googleUsers: SortOrderSchema.optional(),
  otherUsers: SortOrderSchema.optional(),
  visitDurationYandexInSec: SortOrderSchema.optional(),
  visitDurationGoogleInSec: SortOrderSchema.optional(),
  visitDurationOtherInSec: SortOrderSchema.optional(),
  bounceYandex: SortOrderSchema.optional(),
  bounceGoogle: SortOrderSchema.optional(),
  bounceOther: SortOrderSchema.optional(),
  leadsYandex: SortOrderSchema.optional(),
  leadsGoogle: SortOrderSchema.optional(),
  leadsOther: SortOrderSchema.optional(),
  _count: z.lazy(() => SiteMetricCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => SiteMetricAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => SiteMetricMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => SiteMetricMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => SiteMetricSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const SiteMetricOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.SiteMetricOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteMetricOrderByWithAggregationInput>;
export const SiteMetricOrderByWithAggregationInputObjectZodSchema = makeSchema();
