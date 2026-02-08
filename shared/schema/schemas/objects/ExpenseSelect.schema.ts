import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { CityArgsObjectSchema as CityArgsObjectSchema } from './CityArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  city_id: z.boolean().optional(),
  date: z.boolean().optional(),
  amount: z.boolean().optional(),
  type: z.boolean().optional(),
  comment: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  city: z.union([z.boolean(), z.lazy(() => CityArgsObjectSchema)]).optional()
}).strict();
export const ExpenseSelectObjectSchema: z.ZodType<Prisma.ExpenseSelect> = makeSchema() as unknown as z.ZodType<Prisma.ExpenseSelect>;
export const ExpenseSelectObjectZodSchema = makeSchema();
