import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { CityArgsObjectSchema as CityArgsObjectSchema } from './CityArgs.schema';
import { CallFindManySchema as CallFindManySchema } from '../findManyCall.schema';
import { CallImportFindManySchema as CallImportFindManySchema } from '../findManyCallImport.schema';
import { SiteMetricFindManySchema as SiteMetricFindManySchema } from '../findManySiteMetric.schema';
import { SiteCountOutputTypeArgsObjectSchema as SiteCountOutputTypeArgsObjectSchema } from './SiteCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  city: z.union([z.boolean(), z.lazy(() => CityArgsObjectSchema)]).optional(),
  calls: z.union([z.boolean(), z.lazy(() => CallFindManySchema)]).optional(),
  callsImport: z.union([z.boolean(), z.lazy(() => CallImportFindManySchema)]).optional(),
  metrics: z.union([z.boolean(), z.lazy(() => SiteMetricFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => SiteCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const SiteIncludeObjectSchema: z.ZodType<Prisma.SiteInclude> = makeSchema() as unknown as z.ZodType<Prisma.SiteInclude>;
export const SiteIncludeObjectZodSchema = makeSchema();
