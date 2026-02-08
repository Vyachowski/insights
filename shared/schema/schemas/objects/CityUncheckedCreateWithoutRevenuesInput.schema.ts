import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteUncheckedCreateNestedManyWithoutCityInputObjectSchema as SiteUncheckedCreateNestedManyWithoutCityInputObjectSchema } from './SiteUncheckedCreateNestedManyWithoutCityInput.schema';
import { ExpenseUncheckedCreateNestedManyWithoutCityInputObjectSchema as ExpenseUncheckedCreateNestedManyWithoutCityInputObjectSchema } from './ExpenseUncheckedCreateNestedManyWithoutCityInput.schema'

const makeSchema = () => z.object({
  id: z.number().int().optional(),
  code: z.string(),
  slug: z.string(),
  name: z.string(),
  population: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  sites: z.lazy(() => SiteUncheckedCreateNestedManyWithoutCityInputObjectSchema).optional(),
  expenses: z.lazy(() => ExpenseUncheckedCreateNestedManyWithoutCityInputObjectSchema).optional()
}).strict();
export const CityUncheckedCreateWithoutRevenuesInputObjectSchema: z.ZodType<Prisma.CityUncheckedCreateWithoutRevenuesInput> = makeSchema() as unknown as z.ZodType<Prisma.CityUncheckedCreateWithoutRevenuesInput>;
export const CityUncheckedCreateWithoutRevenuesInputObjectZodSchema = makeSchema();
