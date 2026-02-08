import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteMetricWhereInputObjectSchema as SiteMetricWhereInputObjectSchema } from './SiteMetricWhereInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => SiteMetricWhereInputObjectSchema).optional()
}).strict();
export const SiteCountOutputTypeCountMetricsArgsObjectSchema = makeSchema();
export const SiteCountOutputTypeCountMetricsArgsObjectZodSchema = makeSchema();
