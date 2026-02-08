import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { ExpenseSelectObjectSchema as ExpenseSelectObjectSchema } from './objects/ExpenseSelect.schema';
import { ExpenseIncludeObjectSchema as ExpenseIncludeObjectSchema } from './objects/ExpenseInclude.schema';
import { ExpenseUpdateInputObjectSchema as ExpenseUpdateInputObjectSchema } from './objects/ExpenseUpdateInput.schema';
import { ExpenseUncheckedUpdateInputObjectSchema as ExpenseUncheckedUpdateInputObjectSchema } from './objects/ExpenseUncheckedUpdateInput.schema';
import { ExpenseWhereUniqueInputObjectSchema as ExpenseWhereUniqueInputObjectSchema } from './objects/ExpenseWhereUniqueInput.schema';

export const ExpenseUpdateOneSchema: z.ZodType<Prisma.ExpenseUpdateArgs> = z.object({ select: ExpenseSelectObjectSchema.optional(), include: ExpenseIncludeObjectSchema.optional(), data: z.union([ExpenseUpdateInputObjectSchema, ExpenseUncheckedUpdateInputObjectSchema]), where: ExpenseWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ExpenseUpdateArgs>;

export const ExpenseUpdateOneZodSchema = z.object({ select: ExpenseSelectObjectSchema.optional(), include: ExpenseIncludeObjectSchema.optional(), data: z.union([ExpenseUpdateInputObjectSchema, ExpenseUncheckedUpdateInputObjectSchema]), where: ExpenseWhereUniqueInputObjectSchema }).strict();