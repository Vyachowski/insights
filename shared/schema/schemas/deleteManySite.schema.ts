import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { SiteWhereInputObjectSchema as SiteWhereInputObjectSchema } from './objects/SiteWhereInput.schema';

export const SiteDeleteManySchema: z.ZodType<Prisma.SiteDeleteManyArgs> = z.object({ where: SiteWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.SiteDeleteManyArgs>;

export const SiteDeleteManyZodSchema = z.object({ where: SiteWhereInputObjectSchema.optional() }).strict();