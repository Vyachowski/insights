import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { CallCountOrderByAggregateInputObjectSchema as CallCountOrderByAggregateInputObjectSchema } from './CallCountOrderByAggregateInput.schema';
import { CallAvgOrderByAggregateInputObjectSchema as CallAvgOrderByAggregateInputObjectSchema } from './CallAvgOrderByAggregateInput.schema';
import { CallMaxOrderByAggregateInputObjectSchema as CallMaxOrderByAggregateInputObjectSchema } from './CallMaxOrderByAggregateInput.schema';
import { CallMinOrderByAggregateInputObjectSchema as CallMinOrderByAggregateInputObjectSchema } from './CallMinOrderByAggregateInput.schema';
import { CallSumOrderByAggregateInputObjectSchema as CallSumOrderByAggregateInputObjectSchema } from './CallSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  site_id: SortOrderSchema.optional(),
  gudok_id: SortOrderSchema.optional(),
  project_id: SortOrderSchema.optional(),
  project_title: SortOrderSchema.optional(),
  dst: SortOrderSchema.optional(),
  adv_channel_id: SortOrderSchema.optional(),
  adv_channel_name: SortOrderSchema.optional(),
  src: SortOrderSchema.optional(),
  duration: SortOrderSchema.optional(),
  billsec: SortOrderSchema.optional(),
  callstatus: SortOrderSchema.optional(),
  date: SortOrderSchema.optional(),
  region: SortOrderSchema.optional(),
  call_number: SortOrderSchema.optional(),
  audio: SortOrderSchema.optional(),
  source: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  updated_at: SortOrderSchema.optional(),
  _count: z.lazy(() => CallCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => CallAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => CallMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => CallMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => CallSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const CallOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.CallOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.CallOrderByWithAggregationInput>;
export const CallOrderByWithAggregationInputObjectZodSchema = makeSchema();
