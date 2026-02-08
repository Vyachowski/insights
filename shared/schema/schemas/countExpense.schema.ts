import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { ExpenseOrderByWithRelationInputObjectSchema as ExpenseOrderByWithRelationInputObjectSchema } from './objects/ExpenseOrderByWithRelationInput.schema';
import { ExpenseWhereInputObjectSchema as ExpenseWhereInputObjectSchema } from './objects/ExpenseWhereInput.schema';
import { ExpenseWhereUniqueInputObjectSchema as ExpenseWhereUniqueInputObjectSchema } from './objects/ExpenseWhereUniqueInput.schema';
import { ExpenseCountAggregateInputObjectSchema as ExpenseCountAggregateInputObjectSchema } from './objects/ExpenseCountAggregateInput.schema';

export const ExpenseCountSchema: z.ZodType<Prisma.ExpenseCountArgs> = z.object({ orderBy: z.union([ExpenseOrderByWithRelationInputObjectSchema, ExpenseOrderByWithRelationInputObjectSchema.array()]).optional(), where: ExpenseWhereInputObjectSchema.optional(), cursor: ExpenseWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), ExpenseCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.ExpenseCountArgs>;

export const ExpenseCountZodSchema = z.object({ orderBy: z.union([ExpenseOrderByWithRelationInputObjectSchema, ExpenseOrderByWithRelationInputObjectSchema.array()]).optional(), where: ExpenseWhereInputObjectSchema.optional(), cursor: ExpenseWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), ExpenseCountAggregateInputObjectSchema ]).optional() }).strict();