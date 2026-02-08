import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { SiteSelectObjectSchema as SiteSelectObjectSchema } from './objects/SiteSelect.schema';
import { SiteCreateManyInputObjectSchema as SiteCreateManyInputObjectSchema } from './objects/SiteCreateManyInput.schema';

export const SiteCreateManyAndReturnSchema: z.ZodType<Prisma.SiteCreateManyAndReturnArgs> = z.object({ select: SiteSelectObjectSchema.optional(), data: z.union([ SiteCreateManyInputObjectSchema, z.array(SiteCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.SiteCreateManyAndReturnArgs>;

export const SiteCreateManyAndReturnZodSchema = z.object({ select: SiteSelectObjectSchema.optional(), data: z.union([ SiteCreateManyInputObjectSchema, z.array(SiteCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();