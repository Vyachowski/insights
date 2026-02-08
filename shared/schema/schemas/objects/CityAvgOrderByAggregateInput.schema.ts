import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  population: SortOrderSchema.optional()
}).strict();
export const CityAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.CityAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.CityAvgOrderByAggregateInput>;
export const CityAvgOrderByAggregateInputObjectZodSchema = makeSchema();
