import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  city_id: SortOrderSchema.optional(),
  amount: SortOrderSchema.optional()
}).strict();
export const RevenueSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.RevenueSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.RevenueSumOrderByAggregateInput>;
export const RevenueSumOrderByAggregateInputObjectZodSchema = makeSchema();
