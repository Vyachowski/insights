import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { SiteSelectObjectSchema as SiteSelectObjectSchema } from './objects/SiteSelect.schema';
import { SiteUpdateManyMutationInputObjectSchema as SiteUpdateManyMutationInputObjectSchema } from './objects/SiteUpdateManyMutationInput.schema';
import { SiteWhereInputObjectSchema as SiteWhereInputObjectSchema } from './objects/SiteWhereInput.schema';

export const SiteUpdateManyAndReturnSchema: z.ZodType<Prisma.SiteUpdateManyAndReturnArgs> = z.object({ select: SiteSelectObjectSchema.optional(), data: SiteUpdateManyMutationInputObjectSchema, where: SiteWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.SiteUpdateManyAndReturnArgs>;

export const SiteUpdateManyAndReturnZodSchema = z.object({ select: SiteSelectObjectSchema.optional(), data: SiteUpdateManyMutationInputObjectSchema, where: SiteWhereInputObjectSchema.optional() }).strict();