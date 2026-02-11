import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { SiteCountOrderByAggregateInputObjectSchema as SiteCountOrderByAggregateInputObjectSchema } from './SiteCountOrderByAggregateInput.schema';
import { SiteAvgOrderByAggregateInputObjectSchema as SiteAvgOrderByAggregateInputObjectSchema } from './SiteAvgOrderByAggregateInput.schema';
import { SiteMaxOrderByAggregateInputObjectSchema as SiteMaxOrderByAggregateInputObjectSchema } from './SiteMaxOrderByAggregateInput.schema';
import { SiteMinOrderByAggregateInputObjectSchema as SiteMinOrderByAggregateInputObjectSchema } from './SiteMinOrderByAggregateInput.schema';
import { SiteSumOrderByAggregateInputObjectSchema as SiteSumOrderByAggregateInputObjectSchema } from './SiteSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  city_id: SortOrderSchema.optional(),
  name: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  group: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  url: SortOrderSchema.optional(),
  yandex_counter_id: SortOrderSchema.optional(),
  google_counter_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  yandex_tag_manager_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  google_tag_manager_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => SiteCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => SiteAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => SiteMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => SiteMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => SiteSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const SiteOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.SiteOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteOrderByWithAggregationInput>;
export const SiteOrderByWithAggregationInputObjectZodSchema = makeSchema();
