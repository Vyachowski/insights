import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteMetricSelectObjectSchema as SiteMetricSelectObjectSchema } from './SiteMetricSelect.schema';
import { SiteMetricIncludeObjectSchema as SiteMetricIncludeObjectSchema } from './SiteMetricInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => SiteMetricSelectObjectSchema).optional(),
  include: z.lazy(() => SiteMetricIncludeObjectSchema).optional()
}).strict();
export const SiteMetricArgsObjectSchema = makeSchema();
export const SiteMetricArgsObjectZodSchema = makeSchema();
