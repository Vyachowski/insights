import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { ExpenseWhereInputObjectSchema as ExpenseWhereInputObjectSchema } from './objects/ExpenseWhereInput.schema';

export const ExpenseDeleteManySchema: z.ZodType<Prisma.ExpenseDeleteManyArgs> = z.object({ where: ExpenseWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ExpenseDeleteManyArgs>;

export const ExpenseDeleteManyZodSchema = z.object({ where: ExpenseWhereInputObjectSchema.optional() }).strict();