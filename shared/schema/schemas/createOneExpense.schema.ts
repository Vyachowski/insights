import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { ExpenseSelectObjectSchema as ExpenseSelectObjectSchema } from './objects/ExpenseSelect.schema';
import { ExpenseIncludeObjectSchema as ExpenseIncludeObjectSchema } from './objects/ExpenseInclude.schema';
import { ExpenseCreateInputObjectSchema as ExpenseCreateInputObjectSchema } from './objects/ExpenseCreateInput.schema';
import { ExpenseUncheckedCreateInputObjectSchema as ExpenseUncheckedCreateInputObjectSchema } from './objects/ExpenseUncheckedCreateInput.schema';

export const ExpenseCreateOneSchema: z.ZodType<Prisma.ExpenseCreateArgs> = z.object({ select: ExpenseSelectObjectSchema.optional(), include: ExpenseIncludeObjectSchema.optional(), data: z.union([ExpenseCreateInputObjectSchema, ExpenseUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.ExpenseCreateArgs>;

export const ExpenseCreateOneZodSchema = z.object({ select: ExpenseSelectObjectSchema.optional(), include: ExpenseIncludeObjectSchema.optional(), data: z.union([ExpenseCreateInputObjectSchema, ExpenseUncheckedCreateInputObjectSchema]) }).strict();