import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { ExpenseSelectObjectSchema as ExpenseSelectObjectSchema } from './ExpenseSelect.schema';
import { ExpenseIncludeObjectSchema as ExpenseIncludeObjectSchema } from './ExpenseInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => ExpenseSelectObjectSchema).optional(),
  include: z.lazy(() => ExpenseIncludeObjectSchema).optional()
}).strict();
export const ExpenseArgsObjectSchema = makeSchema();
export const ExpenseArgsObjectZodSchema = makeSchema();
