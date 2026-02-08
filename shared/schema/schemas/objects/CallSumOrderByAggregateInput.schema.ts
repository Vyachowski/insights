import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  site_id: SortOrderSchema.optional(),
  gudok_id: SortOrderSchema.optional(),
  project_id: SortOrderSchema.optional(),
  duration: SortOrderSchema.optional(),
  billsec: SortOrderSchema.optional(),
  call_number: SortOrderSchema.optional()
}).strict();
export const CallSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.CallSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.CallSumOrderByAggregateInput>;
export const CallSumOrderByAggregateInputObjectZodSchema = makeSchema();
