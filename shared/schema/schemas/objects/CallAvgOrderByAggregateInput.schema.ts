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
export const CallAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.CallAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.CallAvgOrderByAggregateInput>;
export const CallAvgOrderByAggregateInputObjectZodSchema = makeSchema();
