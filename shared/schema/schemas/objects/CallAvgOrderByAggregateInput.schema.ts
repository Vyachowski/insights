import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  siteId: SortOrderSchema.optional(),
  gudokId: SortOrderSchema.optional(),
  projectId: SortOrderSchema.optional(),
  duration: SortOrderSchema.optional(),
  billsec: SortOrderSchema.optional(),
  callNumber: SortOrderSchema.optional()
}).strict();
export const CallAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.CallAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.CallAvgOrderByAggregateInput>;
export const CallAvgOrderByAggregateInputObjectZodSchema = makeSchema();
