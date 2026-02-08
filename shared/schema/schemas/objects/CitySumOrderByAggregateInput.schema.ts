import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  population: SortOrderSchema.optional()
}).strict();
export const CitySumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.CitySumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.CitySumOrderByAggregateInput>;
export const CitySumOrderByAggregateInputObjectZodSchema = makeSchema();
