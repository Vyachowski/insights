import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { CityArgsObjectSchema as CityArgsObjectSchema } from './CityArgs.schema'

const makeSchema = () => z.object({
  city: z.union([z.boolean(), z.lazy(() => CityArgsObjectSchema)]).optional()
}).strict();
export const ExpenseIncludeObjectSchema: z.ZodType<Prisma.ExpenseInclude> = makeSchema() as unknown as z.ZodType<Prisma.ExpenseInclude>;
export const ExpenseIncludeObjectZodSchema = makeSchema();
