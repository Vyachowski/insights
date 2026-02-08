import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const ExpenseOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.ExpenseOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ExpenseOrderByRelationAggregateInput>;
export const ExpenseOrderByRelationAggregateInputObjectZodSchema = makeSchema();
