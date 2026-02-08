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
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  city: z.lazy(() => CityOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const RevenueOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.RevenueOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.RevenueOrderByWithRelationInput>;
export const RevenueOrderByWithRelationInputObjectZodSchema = makeSchema();
