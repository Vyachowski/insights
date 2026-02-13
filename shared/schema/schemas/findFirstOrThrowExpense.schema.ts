import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { ExpenseIncludeObjectSchema as ExpenseIncludeObjectSchema } from './objects/ExpenseInclude.schema';
import { ExpenseOrderByWithRelationInputObjectSchema as ExpenseOrderByWithRelationInputObjectSchema } from './objects/ExpenseOrderByWithRelationInput.schema';
import { ExpenseWhereInputObjectSchema as ExpenseWhereInputObjectSchema } from './objects/ExpenseWhereInput.schema';
import { ExpenseWhereUniqueInputObjectSchema as ExpenseWhereUniqueInputObjectSchema } from './objects/ExpenseWhereUniqueInput.schema';
import { ExpenseScalarFieldEnumSchema } from './enums/ExpenseScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const ExpenseFindFirstOrThrowSelectSchema: z.ZodType<Prisma.ExpenseSelect> = z.object({
    id: z.boolean().optional(),
    cityId: z.boolean().optional(),
    date: z.boolean().optional(),
    amount: z.boolean().optional(),
    type: z.boolean().optional(),
    comment: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    city: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.ExpenseSelect>;

export const ExpenseFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    cityId: z.boolean().optional(),
    date: z.boolean().optional(),
    amount: z.boolean().optional(),
    type: z.boolean().optional(),
    comment: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    city: z.boolean().optional()
  }).strict();

export const ExpenseFindFirstOrThrowSchema: z.ZodType<Prisma.ExpenseFindFirstOrThrowArgs> = z.object({ select: ExpenseFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => ExpenseIncludeObjectSchema.optional()), orderBy: z.union([ExpenseOrderByWithRelationInputObjectSchema, ExpenseOrderByWithRelationInputObjectSchema.array()]).optional(), where: ExpenseWhereInputObjectSchema.optional(), cursor: ExpenseWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ExpenseScalarFieldEnumSchema, ExpenseScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.ExpenseFindFirstOrThrowArgs>;

export const ExpenseFindFirstOrThrowZodSchema = z.object({ select: ExpenseFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => ExpenseIncludeObjectSchema.optional()), orderBy: z.union([ExpenseOrderByWithRelationInputObjectSchema, ExpenseOrderByWithRelationInputObjectSchema.array()]).optional(), where: ExpenseWhereInputObjectSchema.optional(), cursor: ExpenseWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ExpenseScalarFieldEnumSchema, ExpenseScalarFieldEnumSchema.array()]).optional() }).strict();