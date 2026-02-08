import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { ExpenseWhereInputObjectSchema as ExpenseWhereInputObjectSchema } from './ExpenseWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => ExpenseWhereInputObjectSchema).optional(),
  some: z.lazy(() => ExpenseWhereInputObjectSchema).optional(),
  none: z.lazy(() => ExpenseWhereInputObjectSchema).optional()
}).strict();
export const ExpenseListRelationFilterObjectSchema: z.ZodType<Prisma.ExpenseListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.ExpenseListRelationFilter>;
export const ExpenseListRelationFilterObjectZodSchema = makeSchema();
