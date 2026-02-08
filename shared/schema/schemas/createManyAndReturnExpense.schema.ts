import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { ExpenseSelectObjectSchema as ExpenseSelectObjectSchema } from './objects/ExpenseSelect.schema';
import { ExpenseCreateManyInputObjectSchema as ExpenseCreateManyInputObjectSchema } from './objects/ExpenseCreateManyInput.schema';

export const ExpenseCreateManyAndReturnSchema: z.ZodType<Prisma.ExpenseCreateManyAndReturnArgs> = z.object({ select: ExpenseSelectObjectSchema.optional(), data: z.union([ ExpenseCreateManyInputObjectSchema, z.array(ExpenseCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.ExpenseCreateManyAndReturnArgs>;

export const ExpenseCreateManyAndReturnZodSchema = z.object({ select: ExpenseSelectObjectSchema.optional(), data: z.union([ ExpenseCreateManyInputObjectSchema, z.array(ExpenseCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();