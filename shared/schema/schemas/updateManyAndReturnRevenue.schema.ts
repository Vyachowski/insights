import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { RevenueSelectObjectSchema as RevenueSelectObjectSchema } from './objects/RevenueSelect.schema';
import { RevenueUpdateManyMutationInputObjectSchema as RevenueUpdateManyMutationInputObjectSchema } from './objects/RevenueUpdateManyMutationInput.schema';
import { RevenueWhereInputObjectSchema as RevenueWhereInputObjectSchema } from './objects/RevenueWhereInput.schema';

export const RevenueUpdateManyAndReturnSchema: z.ZodType<Prisma.RevenueUpdateManyAndReturnArgs> = z.object({ select: RevenueSelectObjectSchema.optional(), data: RevenueUpdateManyMutationInputObjectSchema, where: RevenueWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.RevenueUpdateManyAndReturnArgs>;

export const RevenueUpdateManyAndReturnZodSchema = z.object({ select: RevenueSelectObjectSchema.optional(), data: RevenueUpdateManyMutationInputObjectSchema, where: RevenueWhereInputObjectSchema.optional() }).strict();