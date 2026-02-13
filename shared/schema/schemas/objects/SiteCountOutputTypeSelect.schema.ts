import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteCountOutputTypeCountCallsArgsObjectSchema as SiteCountOutputTypeCountCallsArgsObjectSchema } from './SiteCountOutputTypeCountCallsArgs.schema';
import { SiteCountOutputTypeCountCallsImportArgsObjectSchema as SiteCountOutputTypeCountCallsImportArgsObjectSchema } from './SiteCountOutputTypeCountCallsImportArgs.schema';
import { SiteCountOutputTypeCountMetricsArgsObjectSchema as SiteCountOutputTypeCountMetricsArgsObjectSchema } from './SiteCountOutputTypeCountMetricsArgs.schema'

const makeSchema = () => z.object({
  calls: z.union([z.boolean(), z.lazy(() => SiteCountOutputTypeCountCallsArgsObjectSchema)]).optional(),
  callsImport: z.union([z.boolean(), z.lazy(() => SiteCountOutputTypeCountCallsImportArgsObjectSchema)]).optional(),
  metrics: z.union([z.boolean(), z.lazy(() => SiteCountOutputTypeCountMetricsArgsObjectSchema)]).optional()
}).strict();
export const SiteCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.SiteCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.SiteCountOutputTypeSelect>;
export const SiteCountOutputTypeSelectObjectZodSchema = makeSchema();
