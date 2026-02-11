import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { CityArgsObjectSchema as CityArgsObjectSchema } from './CityArgs.schema';
import { CallFindManySchema as CallFindManySchema } from '../findManyCall.schema';
import { CallImportFindManySchema as CallImportFindManySchema } from '../findManyCallImport.schema';
import { SiteMetricFindManySchema as SiteMetricFindManySchema } from '../findManySiteMetric.schema';
import { SiteCountOutputTypeArgsObjectSchema as SiteCountOutputTypeArgsObjectSchema } from './SiteCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  city_id: z.boolean().optional(),
  name: z.boolean().optional(),
  group: z.boolean().optional(),
  url: z.boolean().optional(),
  yandex_counter_id: z.boolean().optional(),
  google_counter_id: z.boolean().optional(),
  yandex_tag_manager_id: z.boolean().optional(),
  google_tag_manager_id: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  city: z.union([z.boolean(), z.lazy(() => CityArgsObjectSchema)]).optional(),
  calls: z.union([z.boolean(), z.lazy(() => CallFindManySchema)]).optional(),
  callsRaw: z.union([z.boolean(), z.lazy(() => CallImportFindManySchema)]).optional(),
  metrics: z.union([z.boolean(), z.lazy(() => SiteMetricFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => SiteCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const SiteSelectObjectSchema: z.ZodType<Prisma.SiteSelect> = makeSchema() as unknown as z.ZodType<Prisma.SiteSelect>;
export const SiteSelectObjectZodSchema = makeSchema();
