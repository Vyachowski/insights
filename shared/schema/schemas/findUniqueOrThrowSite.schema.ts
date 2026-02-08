import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { SiteSelectObjectSchema as SiteSelectObjectSchema } from './objects/SiteSelect.schema';
import { SiteIncludeObjectSchema as SiteIncludeObjectSchema } from './objects/SiteInclude.schema';
import { SiteWhereUniqueInputObjectSchema as SiteWhereUniqueInputObjectSchema } from './objects/SiteWhereUniqueInput.schema';

export const SiteFindUniqueOrThrowSchema: z.ZodType<Prisma.SiteFindUniqueOrThrowArgs> = z.object({ select: SiteSelectObjectSchema.optional(), include: SiteIncludeObjectSchema.optional(), where: SiteWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.SiteFindUniqueOrThrowArgs>;

export const SiteFindUniqueOrThrowZodSchema = z.object({ select: SiteSelectObjectSchema.optional(), include: SiteIncludeObjectSchema.optional(), where: SiteWhereUniqueInputObjectSchema }).strict();