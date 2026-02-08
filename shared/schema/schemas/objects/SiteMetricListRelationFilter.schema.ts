import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteMetricWhereInputObjectSchema as SiteMetricWhereInputObjectSchema } from './SiteMetricWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => SiteMetricWhereInputObjectSchema).optional(),
  some: z.lazy(() => SiteMetricWhereInputObjectSchema).optional(),
  none: z.lazy(() => SiteMetricWhereInputObjectSchema).optional()
}).strict();
export const SiteMetricListRelationFilterObjectSchema: z.ZodType<Prisma.SiteMetricListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.SiteMetricListRelationFilter>;
export const SiteMetricListRelationFilterObjectZodSchema = makeSchema();
