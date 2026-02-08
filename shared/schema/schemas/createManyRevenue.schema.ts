import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { RevenueCreateManyInputObjectSchema as RevenueCreateManyInputObjectSchema } from './objects/RevenueCreateManyInput.schema';

export const RevenueCreateManySchema: z.ZodType<Prisma.RevenueCreateManyArgs> = z.object({ data: z.union([ RevenueCreateManyInputObjectSchema, z.array(RevenueCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.RevenueCreateManyArgs>;

export const RevenueCreateManyZodSchema = z.object({ data: z.union([ RevenueCreateManyInputObjectSchema, z.array(RevenueCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();