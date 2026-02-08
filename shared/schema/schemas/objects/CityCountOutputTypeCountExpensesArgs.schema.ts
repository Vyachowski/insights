import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { ExpenseWhereInputObjectSchema as ExpenseWhereInputObjectSchema } from './ExpenseWhereInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ExpenseWhereInputObjectSchema).optional()
}).strict();
export const CityCountOutputTypeCountExpensesArgsObjectSchema = makeSchema();
export const CityCountOutputTypeCountExpensesArgsObjectZodSchema = makeSchema();
