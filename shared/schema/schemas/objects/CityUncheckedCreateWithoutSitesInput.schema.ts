import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { RevenueUncheckedCreateNestedManyWithoutCityInputObjectSchema as RevenueUncheckedCreateNestedManyWithoutCityInputObjectSchema } from './RevenueUncheckedCreateNestedManyWithoutCityInput.schema';
import { ExpenseUncheckedCreateNestedManyWithoutCityInputObjectSchema as ExpenseUncheckedCreateNestedManyWithoutCityInputObjectSchema } from './ExpenseUncheckedCreateNestedManyWithoutCityInput.schema'

const makeSchema = () => z.object({
  id: z.number().int().optional(),
  code: z.string(),
  slug: z.string(),
  name: z.string(),
  population: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  revenues: z.lazy(() => RevenueUncheckedCreateNestedManyWithoutCityInputObjectSchema).optional(),
  expenses: z.lazy(() => ExpenseUncheckedCreateNestedManyWithoutCityInputObjectSchema).optional()
}).strict();
export const CityUncheckedCreateWithoutSitesInputObjectSchema: z.ZodType<Prisma.CityUncheckedCreateWithoutSitesInput> = makeSchema() as unknown as z.ZodType<Prisma.CityUncheckedCreateWithoutSitesInput>;
export const CityUncheckedCreateWithoutSitesInputObjectZodSchema = makeSchema();
