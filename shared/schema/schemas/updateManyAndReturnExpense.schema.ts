import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { ExpenseSelectObjectSchema as ExpenseSelectObjectSchema } from './objects/ExpenseSelect.schema';
import { ExpenseUpdateManyMutationInputObjectSchema as ExpenseUpdateManyMutationInputObjectSchema } from './objects/ExpenseUpdateManyMutationInput.schema';
import { ExpenseWhereInputObjectSchema as ExpenseWhereInputObjectSchema } from './objects/ExpenseWhereInput.schema';

export const ExpenseUpdateManyAndReturnSchema: z.ZodType<Prisma.ExpenseUpdateManyAndReturnArgs> = z.object({ select: ExpenseSelectObjectSchema.optional(), data: ExpenseUpdateManyMutationInputObjectSchema, where: ExpenseWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ExpenseUpdateManyAndReturnArgs>;

export const ExpenseUpdateManyAndReturnZodSchema = z.object({ select: ExpenseSelectObjectSchema.optional(), data: ExpenseUpdateManyMutationInputObjectSchema, where: ExpenseWhereInputObjectSchema.optional() }).strict();