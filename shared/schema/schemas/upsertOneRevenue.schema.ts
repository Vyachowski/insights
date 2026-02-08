import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { RevenueSelectObjectSchema as RevenueSelectObjectSchema } from './objects/RevenueSelect.schema';
import { RevenueIncludeObjectSchema as RevenueIncludeObjectSchema } from './objects/RevenueInclude.schema';
import { RevenueWhereUniqueInputObjectSchema as RevenueWhereUniqueInputObjectSchema } from './objects/RevenueWhereUniqueInput.schema';
import { RevenueCreateInputObjectSchema as RevenueCreateInputObjectSchema } from './objects/RevenueCreateInput.schema';
import { RevenueUncheckedCreateInputObjectSchema as RevenueUncheckedCreateInputObjectSchema } from './objects/RevenueUncheckedCreateInput.schema';
import { RevenueUpdateInputObjectSchema as RevenueUpdateInputObjectSchema } from './objects/RevenueUpdateInput.schema';
import { RevenueUncheckedUpdateInputObjectSchema as RevenueUncheckedUpdateInputObjectSchema } from './objects/RevenueUncheckedUpdateInput.schema';

export const RevenueUpsertOneSchema: z.ZodType<Prisma.RevenueUpsertArgs> = z.object({ select: RevenueSelectObjectSchema.optional(), include: RevenueIncludeObjectSchema.optional(), where: RevenueWhereUniqueInputObjectSchema, create: z.union([ RevenueCreateInputObjectSchema, RevenueUncheckedCreateInputObjectSchema ]), update: z.union([ RevenueUpdateInputObjectSchema, RevenueUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.RevenueUpsertArgs>;

export const RevenueUpsertOneZodSchema = z.object({ select: RevenueSelectObjectSchema.optional(), include: RevenueIncludeObjectSchema.optional(), where: RevenueWhereUniqueInputObjectSchema, create: z.union([ RevenueCreateInputObjectSchema, RevenueUncheckedCreateInputObjectSchema ]), update: z.union([ RevenueUpdateInputObjectSchema, RevenueUncheckedUpdateInputObjectSchema ]) }).strict();