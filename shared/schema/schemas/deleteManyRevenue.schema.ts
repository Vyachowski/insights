import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { RevenueWhereInputObjectSchema as RevenueWhereInputObjectSchema } from './objects/RevenueWhereInput.schema';

export const RevenueDeleteManySchema: z.ZodType<Prisma.RevenueDeleteManyArgs> = z.object({ where: RevenueWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.RevenueDeleteManyArgs>;

export const RevenueDeleteManyZodSchema = z.object({ where: RevenueWhereInputObjectSchema.optional() }).strict();