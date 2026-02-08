import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { CityArgsObjectSchema as CityArgsObjectSchema } from './CityArgs.schema'

const makeSchema = () => z.object({
  city: z.union([z.boolean(), z.lazy(() => CityArgsObjectSchema)]).optional()
}).strict();
export const RevenueIncludeObjectSchema: z.ZodType<Prisma.RevenueInclude> = makeSchema() as unknown as z.ZodType<Prisma.RevenueInclude>;
export const RevenueIncludeObjectZodSchema = makeSchema();
