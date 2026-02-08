import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { CallOrderByWithRelationInputObjectSchema as CallOrderByWithRelationInputObjectSchema } from './objects/CallOrderByWithRelationInput.schema';
import { CallWhereInputObjectSchema as CallWhereInputObjectSchema } from './objects/CallWhereInput.schema';
import { CallWhereUniqueInputObjectSchema as CallWhereUniqueInputObjectSchema } from './objects/CallWhereUniqueInput.schema';
import { CallCountAggregateInputObjectSchema as CallCountAggregateInputObjectSchema } from './objects/CallCountAggregateInput.schema';
import { CallMinAggregateInputObjectSchema as CallMinAggregateInputObjectSchema } from './objects/CallMinAggregateInput.schema';
import { CallMaxAggregateInputObjectSchema as CallMaxAggregateInputObjectSchema } from './objects/CallMaxAggregateInput.schema';
import { CallAvgAggregateInputObjectSchema as CallAvgAggregateInputObjectSchema } from './objects/CallAvgAggregateInput.schema';
import { CallSumAggregateInputObjectSchema as CallSumAggregateInputObjectSchema } from './objects/CallSumAggregateInput.schema';

export const CallAggregateSchema: z.ZodType<Prisma.CallAggregateArgs> = z.object({ orderBy: z.union([CallOrderByWithRelationInputObjectSchema, CallOrderByWithRelationInputObjectSchema.array()]).optional(), where: CallWhereInputObjectSchema.optional(), cursor: CallWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), CallCountAggregateInputObjectSchema ]).optional(), _min: CallMinAggregateInputObjectSchema.optional(), _max: CallMaxAggregateInputObjectSchema.optional(), _avg: CallAvgAggregateInputObjectSchema.optional(), _sum: CallSumAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.CallAggregateArgs>;

export const CallAggregateZodSchema = z.object({ orderBy: z.union([CallOrderByWithRelationInputObjectSchema, CallOrderByWithRelationInputObjectSchema.array()]).optional(), where: CallWhereInputObjectSchema.optional(), cursor: CallWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), CallCountAggregateInputObjectSchema ]).optional(), _min: CallMinAggregateInputObjectSchema.optional(), _max: CallMaxAggregateInputObjectSchema.optional(), _avg: CallAvgAggregateInputObjectSchema.optional(), _sum: CallSumAggregateInputObjectSchema.optional() }).strict();