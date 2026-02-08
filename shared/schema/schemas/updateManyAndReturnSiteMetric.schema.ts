import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { SiteMetricSelectObjectSchema as SiteMetricSelectObjectSchema } from './objects/SiteMetricSelect.schema';
import { SiteMetricUpdateManyMutationInputObjectSchema as SiteMetricUpdateManyMutationInputObjectSchema } from './objects/SiteMetricUpdateManyMutationInput.schema';
import { SiteMetricWhereInputObjectSchema as SiteMetricWhereInputObjectSchema } from './objects/SiteMetricWhereInput.schema';

export const SiteMetricUpdateManyAndReturnSchema: z.ZodType<Prisma.SiteMetricUpdateManyAndReturnArgs> = z.object({ select: SiteMetricSelectObjectSchema.optional(), data: SiteMetricUpdateManyMutationInputObjectSchema, where: SiteMetricWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.SiteMetricUpdateManyAndReturnArgs>;

export const SiteMetricUpdateManyAndReturnZodSchema = z.object({ select: SiteMetricSelectObjectSchema.optional(), data: SiteMetricUpdateManyMutationInputObjectSchema, where: SiteMetricWhereInputObjectSchema.optional() }).strict();