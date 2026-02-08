import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { CityOrderByWithRelationInputObjectSchema as CityOrderByWithRelationInputObjectSchema } from './CityOrderByWithRelationInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  city_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  date: SortOrderSchema.optional(),
  amount: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  comment: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  city: z.lazy(() => CityOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const ExpenseOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.ExpenseOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.ExpenseOrderByWithRelationInput>;
export const ExpenseOrderByWithRelationInputObjectZodSchema = makeSchema();
