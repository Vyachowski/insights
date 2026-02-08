import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { SiteUpdateManyMutationInputObjectSchema as SiteUpdateManyMutationInputObjectSchema } from './objects/SiteUpdateManyMutationInput.schema';
import { SiteWhereInputObjectSchema as SiteWhereInputObjectSchema } from './objects/SiteWhereInput.schema';

export const SiteUpdateManySchema: z.ZodType<Prisma.SiteUpdateManyArgs> = z.object({ data: SiteUpdateManyMutationInputObjectSchema, where: SiteWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.SiteUpdateManyArgs>;

export const SiteUpdateManyZodSchema = z.object({ data: SiteUpdateManyMutationInputObjectSchema, where: SiteWhereInputObjectSchema.optional() }).strict();