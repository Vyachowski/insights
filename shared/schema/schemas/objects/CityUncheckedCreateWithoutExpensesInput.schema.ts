import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteUncheckedCreateNestedManyWithoutCityInputObjectSchema as SiteUncheckedCreateNestedManyWithoutCityInputObjectSchema } from './SiteUncheckedCreateNestedManyWithoutCityInput.schema';
import { RevenueUncheckedCreateNestedManyWithoutCityInputObjectSchema as RevenueUncheckedCreateNestedManyWithoutCityInputObjectSchema } from './RevenueUncheckedCreateNestedManyWithoutCityInput.schema'

const makeSchema = () => z.object({
  id: z.number().int().optional(),
  code: z.string(),
  slug: z.string(),
  name: z.string(),
  population: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  sites: z.lazy(() => SiteUncheckedCreateNestedManyWithoutCityInputObjectSchema).optional(),
  revenues: z.lazy(() => RevenueUncheckedCreateNestedManyWithoutCityInputObjectSchema).optional()
}).strict();
export const CityUncheckedCreateWithoutExpensesInputObjectSchema: z.ZodType<Prisma.CityUncheckedCreateWithoutExpensesInput> = makeSchema() as unknown as z.ZodType<Prisma.CityUncheckedCreateWithoutExpensesInput>;
export const CityUncheckedCreateWithoutExpensesInputObjectZodSchema = makeSchema();
