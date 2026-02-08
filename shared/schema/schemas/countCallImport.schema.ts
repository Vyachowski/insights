import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { CallImportOrderByWithRelationInputObjectSchema as CallImportOrderByWithRelationInputObjectSchema } from './objects/CallImportOrderByWithRelationInput.schema';
import { CallImportWhereInputObjectSchema as CallImportWhereInputObjectSchema } from './objects/CallImportWhereInput.schema';
import { CallImportWhereUniqueInputObjectSchema as CallImportWhereUniqueInputObjectSchema } from './objects/CallImportWhereUniqueInput.schema';
import { CallImportCountAggregateInputObjectSchema as CallImportCountAggregateInputObjectSchema } from './objects/CallImportCountAggregateInput.schema';

export const CallImportCountSchema: z.ZodType<Prisma.CallImportCountArgs> = z.object({ orderBy: z.union([CallImportOrderByWithRelationInputObjectSchema, CallImportOrderByWithRelationInputObjectSchema.array()]).optional(), where: CallImportWhereInputObjectSchema.optional(), cursor: CallImportWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), CallImportCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.CallImportCountArgs>;

export const CallImportCountZodSchema = z.object({ orderBy: z.union([CallImportOrderByWithRelationInputObjectSchema, CallImportOrderByWithRelationInputObjectSchema.array()]).optional(), where: CallImportWhereInputObjectSchema.optional(), cursor: CallImportWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), CallImportCountAggregateInputObjectSchema ]).optional() }).strict();