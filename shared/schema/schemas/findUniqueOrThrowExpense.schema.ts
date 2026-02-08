import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { ExpenseSelectObjectSchema as ExpenseSelectObjectSchema } from './objects/ExpenseSelect.schema';
import { ExpenseIncludeObjectSchema as ExpenseIncludeObjectSchema } from './objects/ExpenseInclude.schema';
import { ExpenseWhereUniqueInputObjectSchema as ExpenseWhereUniqueInputObjectSchema } from './objects/ExpenseWhereUniqueInput.schema';

export const ExpenseFindUniqueOrThrowSchema: z.ZodType<Prisma.ExpenseFindUniqueOrThrowArgs> = z.object({ select: ExpenseSelectObjectSchema.optional(), include: ExpenseIncludeObjectSchema.optional(), where: ExpenseWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ExpenseFindUniqueOrThrowArgs>;

export const ExpenseFindUniqueOrThrowZodSchema = z.object({ select: ExpenseSelectObjectSchema.optional(), include: ExpenseIncludeObjectSchema.optional(), where: ExpenseWhereUniqueInputObjectSchema }).strict();