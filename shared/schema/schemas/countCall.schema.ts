import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { CallOrderByWithRelationInputObjectSchema as CallOrderByWithRelationInputObjectSchema } from './objects/CallOrderByWithRelationInput.schema';
import { CallWhereInputObjectSchema as CallWhereInputObjectSchema } from './objects/CallWhereInput.schema';
import { CallWhereUniqueInputObjectSchema as CallWhereUniqueInputObjectSchema } from './objects/CallWhereUniqueInput.schema';
import { CallCountAggregateInputObjectSchema as CallCountAggregateInputObjectSchema } from './objects/CallCountAggregateInput.schema';

export const CallCountSchema: z.ZodType<Prisma.CallCountArgs> = z.object({ orderBy: z.union([CallOrderByWithRelationInputObjectSchema, CallOrderByWithRelationInputObjectSchema.array()]).optional(), where: CallWhereInputObjectSchema.optional(), cursor: CallWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), CallCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.CallCountArgs>;

export const CallCountZodSchema = z.object({ orderBy: z.union([CallOrderByWithRelationInputObjectSchema, CallOrderByWithRelationInputObjectSchema.array()]).optional(), where: CallWhereInputObjectSchema.optional(), cursor: CallWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), CallCountAggregateInputObjectSchema ]).optional() }).strict();