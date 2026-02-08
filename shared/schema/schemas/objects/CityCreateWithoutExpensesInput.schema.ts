import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteCreateNestedManyWithoutCityInputObjectSchema as SiteCreateNestedManyWithoutCityInputObjectSchema } from './SiteCreateNestedManyWithoutCityInput.schema';
import { RevenueCreateNestedManyWithoutCityInputObjectSchema as RevenueCreateNestedManyWithoutCityInputObjectSchema } from './RevenueCreateNestedManyWithoutCityInput.schema'

const makeSchema = () => z.object({
  code: z.string(),
  slug: z.string(),
  name: z.string(),
  population: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  sites: z.lazy(() => SiteCreateNestedManyWithoutCityInputObjectSchema).optional(),
  revenues: z.lazy(() => RevenueCreateNestedManyWithoutCityInputObjectSchema).optional()
}).strict();
export const CityCreateWithoutExpensesInputObjectSchema: z.ZodType<Prisma.CityCreateWithoutExpensesInput> = makeSchema() as unknown as z.ZodType<Prisma.CityCreateWithoutExpensesInput>;
export const CityCreateWithoutExpensesInputObjectZodSchema = makeSchema();
