import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteFindManySchema as SiteFindManySchema } from '../findManySite.schema';
import { RevenueFindManySchema as RevenueFindManySchema } from '../findManyRevenue.schema';
import { ExpenseFindManySchema as ExpenseFindManySchema } from '../findManyExpense.schema';
import { CityCountOutputTypeArgsObjectSchema as CityCountOutputTypeArgsObjectSchema } from './CityCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  sites: z.union([z.boolean(), z.lazy(() => SiteFindManySchema)]).optional(),
  revenues: z.union([z.boolean(), z.lazy(() => RevenueFindManySchema)]).optional(),
  expenses: z.union([z.boolean(), z.lazy(() => ExpenseFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => CityCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const CityIncludeObjectSchema: z.ZodType<Prisma.CityInclude> = makeSchema() as unknown as z.ZodType<Prisma.CityInclude>;
export const CityIncludeObjectZodSchema = makeSchema();
