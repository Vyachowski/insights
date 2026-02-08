import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { RevenueSelectObjectSchema as RevenueSelectObjectSchema } from './objects/RevenueSelect.schema';
import { RevenueIncludeObjectSchema as RevenueIncludeObjectSchema } from './objects/RevenueInclude.schema';
import { RevenueWhereUniqueInputObjectSchema as RevenueWhereUniqueInputObjectSchema } from './objects/RevenueWhereUniqueInput.schema';

export const RevenueFindUniqueOrThrowSchema: z.ZodType<Prisma.RevenueFindUniqueOrThrowArgs> = z.object({ select: RevenueSelectObjectSchema.optional(), include: RevenueIncludeObjectSchema.optional(), where: RevenueWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.RevenueFindUniqueOrThrowArgs>;

export const RevenueFindUniqueOrThrowZodSchema = z.object({ select: RevenueSelectObjectSchema.optional(), include: RevenueIncludeObjectSchema.optional(), where: RevenueWhereUniqueInputObjectSchema }).strict();