import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { ExpenseSelectObjectSchema as ExpenseSelectObjectSchema } from './objects/ExpenseSelect.schema';
import { ExpenseIncludeObjectSchema as ExpenseIncludeObjectSchema } from './objects/ExpenseInclude.schema';
import { ExpenseWhereUniqueInputObjectSchema as ExpenseWhereUniqueInputObjectSchema } from './objects/ExpenseWhereUniqueInput.schema';
import { ExpenseCreateInputObjectSchema as ExpenseCreateInputObjectSchema } from './objects/ExpenseCreateInput.schema';
import { ExpenseUncheckedCreateInputObjectSchema as ExpenseUncheckedCreateInputObjectSchema } from './objects/ExpenseUncheckedCreateInput.schema';
import { ExpenseUpdateInputObjectSchema as ExpenseUpdateInputObjectSchema } from './objects/ExpenseUpdateInput.schema';
import { ExpenseUncheckedUpdateInputObjectSchema as ExpenseUncheckedUpdateInputObjectSchema } from './objects/ExpenseUncheckedUpdateInput.schema';

export const ExpenseUpsertOneSchema: z.ZodType<Prisma.ExpenseUpsertArgs> = z.object({ select: ExpenseSelectObjectSchema.optional(), include: ExpenseIncludeObjectSchema.optional(), where: ExpenseWhereUniqueInputObjectSchema, create: z.union([ ExpenseCreateInputObjectSchema, ExpenseUncheckedCreateInputObjectSchema ]), update: z.union([ ExpenseUpdateInputObjectSchema, ExpenseUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.ExpenseUpsertArgs>;

export const ExpenseUpsertOneZodSchema = z.object({ select: ExpenseSelectObjectSchema.optional(), include: ExpenseIncludeObjectSchema.optional(), where: ExpenseWhereUniqueInputObjectSchema, create: z.union([ ExpenseCreateInputObjectSchema, ExpenseUncheckedCreateInputObjectSchema ]), update: z.union([ ExpenseUpdateInputObjectSchema, ExpenseUncheckedUpdateInputObjectSchema ]) }).strict();