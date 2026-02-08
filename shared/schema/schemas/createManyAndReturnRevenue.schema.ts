import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { RevenueSelectObjectSchema as RevenueSelectObjectSchema } from './objects/RevenueSelect.schema';
import { RevenueCreateManyInputObjectSchema as RevenueCreateManyInputObjectSchema } from './objects/RevenueCreateManyInput.schema';

export const RevenueCreateManyAndReturnSchema: z.ZodType<Prisma.RevenueCreateManyAndReturnArgs> = z.object({ select: RevenueSelectObjectSchema.optional(), data: z.union([ RevenueCreateManyInputObjectSchema, z.array(RevenueCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.RevenueCreateManyAndReturnArgs>;

export const RevenueCreateManyAndReturnZodSchema = z.object({ select: RevenueSelectObjectSchema.optional(), data: z.union([ RevenueCreateManyInputObjectSchema, z.array(RevenueCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();