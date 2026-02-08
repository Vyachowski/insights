import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { ExpenseUpdateManyMutationInputObjectSchema as ExpenseUpdateManyMutationInputObjectSchema } from './objects/ExpenseUpdateManyMutationInput.schema';
import { ExpenseWhereInputObjectSchema as ExpenseWhereInputObjectSchema } from './objects/ExpenseWhereInput.schema';

export const ExpenseUpdateManySchema: z.ZodType<Prisma.ExpenseUpdateManyArgs> = z.object({ data: ExpenseUpdateManyMutationInputObjectSchema, where: ExpenseWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ExpenseUpdateManyArgs>;

export const ExpenseUpdateManyZodSchema = z.object({ data: ExpenseUpdateManyMutationInputObjectSchema, where: ExpenseWhereInputObjectSchema.optional() }).strict();