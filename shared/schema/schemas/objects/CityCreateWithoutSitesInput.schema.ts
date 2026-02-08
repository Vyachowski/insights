import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { RevenueCreateNestedManyWithoutCityInputObjectSchema as RevenueCreateNestedManyWithoutCityInputObjectSchema } from './RevenueCreateNestedManyWithoutCityInput.schema';
import { ExpenseCreateNestedManyWithoutCityInputObjectSchema as ExpenseCreateNestedManyWithoutCityInputObjectSchema } from './ExpenseCreateNestedManyWithoutCityInput.schema'

const makeSchema = () => z.object({
  code: z.string(),
  slug: z.string(),
  name: z.string(),
  population: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  revenues: z.lazy(() => RevenueCreateNestedManyWithoutCityInputObjectSchema).optional(),
  expenses: z.lazy(() => ExpenseCreateNestedManyWithoutCityInputObjectSchema).optional()
}).strict();
export const CityCreateWithoutSitesInputObjectSchema: z.ZodType<Prisma.CityCreateWithoutSitesInput> = makeSchema() as unknown as z.ZodType<Prisma.CityCreateWithoutSitesInput>;
export const CityCreateWithoutSitesInputObjectZodSchema = makeSchema();
