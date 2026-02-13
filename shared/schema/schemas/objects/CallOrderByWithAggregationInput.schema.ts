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
  siteId: SortOrderSchema.optional(),
  gudokId: SortOrderSchema.optional(),
  projectId: SortOrderSchema.optional(),
  projectTitle: SortOrderSchema.optional(),
  dst: SortOrderSchema.optional(),
  advChannelId: SortOrderSchema.optional(),
  advChannelName: SortOrderSchema.optional(),
  src: SortOrderSchema.optional(),
  duration: SortOrderSchema.optional(),
  billsec: SortOrderSchema.optional(),
  callstatus: SortOrderSchema.optional(),
  date: SortOrderSchema.optional(),
  region: SortOrderSchema.optional(),
  callNumber: SortOrderSchema.optional(),
  audio: SortOrderSchema.optional(),
  source: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => CallCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => CallAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => CallMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => CallMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => CallSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const CallOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.CallOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.CallOrderByWithAggregationInput>;
export const CallOrderByWithAggregationInputObjectZodSchema = makeSchema();
