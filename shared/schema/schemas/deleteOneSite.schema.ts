import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { SiteSelectObjectSchema as SiteSelectObjectSchema } from './objects/SiteSelect.schema';
import { SiteIncludeObjectSchema as SiteIncludeObjectSchema } from './objects/SiteInclude.schema';
import { SiteWhereUniqueInputObjectSchema as SiteWhereUniqueInputObjectSchema } from './objects/SiteWhereUniqueInput.schema';

export const SiteDeleteOneSchema: z.ZodType<Prisma.SiteDeleteArgs> = z.object({ select: SiteSelectObjectSchema.optional(), include: SiteIncludeObjectSchema.optional(), where: SiteWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.SiteDeleteArgs>;

export const SiteDeleteOneZodSchema = z.object({ select: SiteSelectObjectSchema.optional(), include: SiteIncludeObjectSchema.optional(), where: SiteWhereUniqueInputObjectSchema }).strict();