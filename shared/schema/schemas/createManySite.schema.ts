import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { SiteCreateManyInputObjectSchema as SiteCreateManyInputObjectSchema } from './objects/SiteCreateManyInput.schema';

export const SiteCreateManySchema: z.ZodType<Prisma.SiteCreateManyArgs> = z.object({ data: z.union([ SiteCreateManyInputObjectSchema, z.array(SiteCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.SiteCreateManyArgs>;

export const SiteCreateManyZodSchema = z.object({ data: z.union([ SiteCreateManyInputObjectSchema, z.array(SiteCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();