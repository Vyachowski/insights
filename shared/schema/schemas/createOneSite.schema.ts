import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { SiteSelectObjectSchema as SiteSelectObjectSchema } from './objects/SiteSelect.schema';
import { SiteIncludeObjectSchema as SiteIncludeObjectSchema } from './objects/SiteInclude.schema';
import { SiteCreateInputObjectSchema as SiteCreateInputObjectSchema } from './objects/SiteCreateInput.schema';
import { SiteUncheckedCreateInputObjectSchema as SiteUncheckedCreateInputObjectSchema } from './objects/SiteUncheckedCreateInput.schema';

export const SiteCreateOneSchema: z.ZodType<Prisma.SiteCreateArgs> = z.object({ select: SiteSelectObjectSchema.optional(), include: SiteIncludeObjectSchema.optional(), data: z.union([SiteCreateInputObjectSchema, SiteUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.SiteCreateArgs>;

export const SiteCreateOneZodSchema = z.object({ select: SiteSelectObjectSchema.optional(), include: SiteIncludeObjectSchema.optional(), data: z.union([SiteCreateInputObjectSchema, SiteUncheckedCreateInputObjectSchema]) }).strict();