import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { SiteSelectObjectSchema as SiteSelectObjectSchema } from './objects/SiteSelect.schema';
import { SiteIncludeObjectSchema as SiteIncludeObjectSchema } from './objects/SiteInclude.schema';
import { SiteWhereUniqueInputObjectSchema as SiteWhereUniqueInputObjectSchema } from './objects/SiteWhereUniqueInput.schema';
import { SiteCreateInputObjectSchema as SiteCreateInputObjectSchema } from './objects/SiteCreateInput.schema';
import { SiteUncheckedCreateInputObjectSchema as SiteUncheckedCreateInputObjectSchema } from './objects/SiteUncheckedCreateInput.schema';
import { SiteUpdateInputObjectSchema as SiteUpdateInputObjectSchema } from './objects/SiteUpdateInput.schema';
import { SiteUncheckedUpdateInputObjectSchema as SiteUncheckedUpdateInputObjectSchema } from './objects/SiteUncheckedUpdateInput.schema';

export const SiteUpsertOneSchema: z.ZodType<Prisma.SiteUpsertArgs> = z.object({ select: SiteSelectObjectSchema.optional(), include: SiteIncludeObjectSchema.optional(), where: SiteWhereUniqueInputObjectSchema, create: z.union([ SiteCreateInputObjectSchema, SiteUncheckedCreateInputObjectSchema ]), update: z.union([ SiteUpdateInputObjectSchema, SiteUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.SiteUpsertArgs>;

export const SiteUpsertOneZodSchema = z.object({ select: SiteSelectObjectSchema.optional(), include: SiteIncludeObjectSchema.optional(), where: SiteWhereUniqueInputObjectSchema, create: z.union([ SiteCreateInputObjectSchema, SiteUncheckedCreateInputObjectSchema ]), update: z.union([ SiteUpdateInputObjectSchema, SiteUncheckedUpdateInputObjectSchema ]) }).strict();