import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { ExpenseCreateManyInputObjectSchema as ExpenseCreateManyInputObjectSchema } from './objects/ExpenseCreateManyInput.schema';

export const ExpenseCreateManySchema: z.ZodType<Prisma.ExpenseCreateManyArgs> = z.object({ data: z.union([ ExpenseCreateManyInputObjectSchema, z.array(ExpenseCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.ExpenseCreateManyArgs>;

export const ExpenseCreateManyZodSchema = z.object({ data: z.union([ ExpenseCreateManyInputObjectSchema, z.array(ExpenseCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();