import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { CityCountOutputTypeCountSitesArgsObjectSchema as CityCountOutputTypeCountSitesArgsObjectSchema } from './CityCountOutputTypeCountSitesArgs.schema';
import { CityCountOutputTypeCountRevenuesArgsObjectSchema as CityCountOutputTypeCountRevenuesArgsObjectSchema } from './CityCountOutputTypeCountRevenuesArgs.schema';
import { CityCountOutputTypeCountExpensesArgsObjectSchema as CityCountOutputTypeCountExpensesArgsObjectSchema } from './CityCountOutputTypeCountExpensesArgs.schema'

const makeSchema = () => z.object({
  sites: z.union([z.boolean(), z.lazy(() => CityCountOutputTypeCountSitesArgsObjectSchema)]).optional(),
  revenues: z.union([z.boolean(), z.lazy(() => CityCountOutputTypeCountRevenuesArgsObjectSchema)]).optional(),
  expenses: z.union([z.boolean(), z.lazy(() => CityCountOutputTypeCountExpensesArgsObjectSchema)]).optional()
}).strict();
export const CityCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.CityCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.CityCountOutputTypeSelect>;
export const CityCountOutputTypeSelectObjectZodSchema = makeSchema();
