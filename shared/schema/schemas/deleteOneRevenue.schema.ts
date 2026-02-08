import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { RevenueSelectObjectSchema as RevenueSelectObjectSchema } from './objects/RevenueSelect.schema';
import { RevenueIncludeObjectSchema as RevenueIncludeObjectSchema } from './objects/RevenueInclude.schema';
import { RevenueWhereUniqueInputObjectSchema as RevenueWhereUniqueInputObjectSchema } from './objects/RevenueWhereUniqueInput.schema';

export const RevenueDeleteOneSchema: z.ZodType<Prisma.RevenueDeleteArgs> = z.object({ select: RevenueSelectObjectSchema.optional(), include: RevenueIncludeObjectSchema.optional(), where: RevenueWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.RevenueDeleteArgs>;

export const RevenueDeleteOneZodSchema = z.object({ select: RevenueSelectObjectSchema.optional(), include: RevenueIncludeObjectSchema.optional(), where: RevenueWhereUniqueInputObjectSchema }).strict();