import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { RevenueSelectObjectSchema as RevenueSelectObjectSchema } from './objects/RevenueSelect.schema';
import { RevenueIncludeObjectSchema as RevenueIncludeObjectSchema } from './objects/RevenueInclude.schema';
import { RevenueCreateInputObjectSchema as RevenueCreateInputObjectSchema } from './objects/RevenueCreateInput.schema';
import { RevenueUncheckedCreateInputObjectSchema as RevenueUncheckedCreateInputObjectSchema } from './objects/RevenueUncheckedCreateInput.schema';

export const RevenueCreateOneSchema: z.ZodType<Prisma.RevenueCreateArgs> = z.object({ select: RevenueSelectObjectSchema.optional(), include: RevenueIncludeObjectSchema.optional(), data: z.union([RevenueCreateInputObjectSchema, RevenueUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.RevenueCreateArgs>;

export const RevenueCreateOneZodSchema = z.object({ select: RevenueSelectObjectSchema.optional(), include: RevenueIncludeObjectSchema.optional(), data: z.union([RevenueCreateInputObjectSchema, RevenueUncheckedCreateInputObjectSchema]) }).strict();