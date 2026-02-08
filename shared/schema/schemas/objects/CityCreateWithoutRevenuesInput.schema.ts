import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteCreateNestedManyWithoutCityInputObjectSchema as SiteCreateNestedManyWithoutCityInputObjectSchema } from './SiteCreateNestedManyWithoutCityInput.schema';
import { ExpenseCreateNestedManyWithoutCityInputObjectSchema as ExpenseCreateNestedManyWithoutCityInputObjectSchema } from './ExpenseCreateNestedManyWithoutCityInput.schema'

const makeSchema = () => z.object({
  code: z.string(),
  slug: z.string(),
  name: z.string(),
  population: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  sites: z.lazy(() => SiteCreateNestedManyWithoutCityInputObjectSchema).optional(),
  expenses: z.lazy(() => ExpenseCreateNestedManyWithoutCityInputObjectSchema).optional()
}).strict();
export const CityCreateWithoutRevenuesInputObjectSchema: z.ZodType<Prisma.CityCreateWithoutRevenuesInput> = makeSchema() as unknown as z.ZodType<Prisma.CityCreateWithoutRevenuesInput>;
export const CityCreateWithoutRevenuesInputObjectZodSchema = makeSchema();
