import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  code: SortOrderSchema.optional(),
  slug: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  population: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const CityCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.CityCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.CityCountOrderByAggregateInput>;
export const CityCountOrderByAggregateInputObjectZodSchema = makeSchema();
