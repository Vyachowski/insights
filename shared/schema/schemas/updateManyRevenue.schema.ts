import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { RevenueUpdateManyMutationInputObjectSchema as RevenueUpdateManyMutationInputObjectSchema } from './objects/RevenueUpdateManyMutationInput.schema';
import { RevenueWhereInputObjectSchema as RevenueWhereInputObjectSchema } from './objects/RevenueWhereInput.schema';

export const RevenueUpdateManySchema: z.ZodType<Prisma.RevenueUpdateManyArgs> = z.object({ data: RevenueUpdateManyMutationInputObjectSchema, where: RevenueWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.RevenueUpdateManyArgs>;

export const RevenueUpdateManyZodSchema = z.object({ data: RevenueUpdateManyMutationInputObjectSchema, where: RevenueWhereInputObjectSchema.optional() }).strict();