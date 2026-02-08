import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { ExpenseSelectObjectSchema as ExpenseSelectObjectSchema } from './objects/ExpenseSelect.schema';
import { ExpenseIncludeObjectSchema as ExpenseIncludeObjectSchema } from './objects/ExpenseInclude.schema';
import { ExpenseWhereUniqueInputObjectSchema as ExpenseWhereUniqueInputObjectSchema } from './objects/ExpenseWhereUniqueInput.schema';

export const ExpenseDeleteOneSchema: z.ZodType<Prisma.ExpenseDeleteArgs> = z.object({ select: ExpenseSelectObjectSchema.optional(), include: ExpenseIncludeObjectSchema.optional(), where: ExpenseWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ExpenseDeleteArgs>;

export const ExpenseDeleteOneZodSchema = z.object({ select: ExpenseSelectObjectSchema.optional(), include: ExpenseIncludeObjectSchema.optional(), where: ExpenseWhereUniqueInputObjectSchema }).strict();