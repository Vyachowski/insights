import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { SiteSelectObjectSchema as SiteSelectObjectSchema } from './objects/SiteSelect.schema';
import { SiteIncludeObjectSchema as SiteIncludeObjectSchema } from './objects/SiteInclude.schema';
import { SiteUpdateInputObjectSchema as SiteUpdateInputObjectSchema } from './objects/SiteUpdateInput.schema';
import { SiteUncheckedUpdateInputObjectSchema as SiteUncheckedUpdateInputObjectSchema } from './objects/SiteUncheckedUpdateInput.schema';
import { SiteWhereUniqueInputObjectSchema as SiteWhereUniqueInputObjectSchema } from './objects/SiteWhereUniqueInput.schema';

export const SiteUpdateOneSchema: z.ZodType<Prisma.SiteUpdateArgs> = z.object({ select: SiteSelectObjectSchema.optional(), include: SiteIncludeObjectSchema.optional(), data: z.union([SiteUpdateInputObjectSchema, SiteUncheckedUpdateInputObjectSchema]), where: SiteWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.SiteUpdateArgs>;

export const SiteUpdateOneZodSchema = z.object({ select: SiteSelectObjectSchema.optional(), include: SiteIncludeObjectSchema.optional(), data: z.union([SiteUpdateInputObjectSchema, SiteUncheckedUpdateInputObjectSchema]), where: SiteWhereUniqueInputObjectSchema }).strict();