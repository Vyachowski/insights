import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { RevenueSelectObjectSchema as RevenueSelectObjectSchema } from './objects/RevenueSelect.schema';
import { RevenueIncludeObjectSchema as RevenueIncludeObjectSchema } from './objects/RevenueInclude.schema';
import { RevenueUpdateInputObjectSchema as RevenueUpdateInputObjectSchema } from './objects/RevenueUpdateInput.schema';
import { RevenueUncheckedUpdateInputObjectSchema as RevenueUncheckedUpdateInputObjectSchema } from './objects/RevenueUncheckedUpdateInput.schema';
import { RevenueWhereUniqueInputObjectSchema as RevenueWhereUniqueInputObjectSchema } from './objects/RevenueWhereUniqueInput.schema';

export const RevenueUpdateOneSchema: z.ZodType<Prisma.RevenueUpdateArgs> = z.object({ select: RevenueSelectObjectSchema.optional(), include: RevenueIncludeObjectSchema.optional(), data: z.union([RevenueUpdateInputObjectSchema, RevenueUncheckedUpdateInputObjectSchema]), where: RevenueWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.RevenueUpdateArgs>;

export const RevenueUpdateOneZodSchema = z.object({ select: RevenueSelectObjectSchema.optional(), include: RevenueIncludeObjectSchema.optional(), data: z.union([RevenueUpdateInputObjectSchema, RevenueUncheckedUpdateInputObjectSchema]), where: RevenueWhereUniqueInputObjectSchema }).strict();