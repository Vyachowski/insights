import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { CallWhereInputObjectSchema as CallWhereInputObjectSchema } from './objects/CallWhereInput.schema';
import { CallOrderByWithAggregationInputObjectSchema as CallOrderByWithAggregationInputObjectSchema } from './objects/CallOrderByWithAggregationInput.schema';
import { CallScalarWhereWithAggregatesInputObjectSchema as CallScalarWhereWithAggregatesInputObjectSchema } from './objects/CallScalarWhereWithAggregatesInput.schema';
import { CallScalarFieldEnumSchema } from './enums/CallScalarFieldEnum.schema';
import { CallCountAggregateInputObjectSchema as CallCountAggregateInputObjectSchema } from './objects/CallCountAggregateInput.schema';
import { CallMinAggregateInputObjectSchema as CallMinAggregateInputObjectSchema } from './objects/CallMinAggregateInput.schema';
import { CallMaxAggregateInputObjectSchema as CallMaxAggregateInputObjectSchema } from './objects/CallMaxAggregateInput.schema';
import { CallAvgAggregateInputObjectSchema as CallAvgAggregateInputObjectSchema } from './objects/CallAvgAggregateInput.schema';
import { CallSumAggregateInputObjectSchema as CallSumAggregateInputObjectSchema } from './objects/CallSumAggregateInput.schema';

export const CallGroupBySchema: z.ZodType<Prisma.CallGroupByArgs> = z.object({ where: CallWhereInputObjectSchema.optional(), orderBy: z.union([CallOrderByWithAggregationInputObjectSchema, CallOrderByWithAggregationInputObjectSchema.array()]).optional(), having: CallScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(CallScalarFieldEnumSchema), _count: z.union([ z.literal(true), CallCountAggregateInputObjectSchema ]).optional(), _min: CallMinAggregateInputObjectSchema.optional(), _max: CallMaxAggregateInputObjectSchema.optional(), _avg: CallAvgAggregateInputObjectSchema.optional(), _sum: CallSumAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.CallGroupByArgs>;

export const CallGroupByZodSchema = z.object({ where: CallWhereInputObjectSchema.optional(), orderBy: z.union([CallOrderByWithAggregationInputObjectSchema, CallOrderByWithAggregationInputObjectSchema.array()]).optional(), having: CallScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(CallScalarFieldEnumSchema), _count: z.union([ z.literal(true), CallCountAggregateInputObjectSchema ]).optional(), _min: CallMinAggregateInputObjectSchema.optional(), _max: CallMaxAggregateInputObjectSchema.optional(), _avg: CallAvgAggregateInputObjectSchema.optional(), _sum: CallSumAggregateInputObjectSchema.optional() }).strict();