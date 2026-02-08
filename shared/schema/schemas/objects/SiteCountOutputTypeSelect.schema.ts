import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteCountOutputTypeCountCallsArgsObjectSchema as SiteCountOutputTypeCountCallsArgsObjectSchema } from './SiteCountOutputTypeCountCallsArgs.schema';
import { SiteCountOutputTypeCountCallsRawArgsObjectSchema as SiteCountOutputTypeCountCallsRawArgsObjectSchema } from './SiteCountOutputTypeCountCallsRawArgs.schema';
import { SiteCountOutputTypeCountMetricsArgsObjectSchema as SiteCountOutputTypeCountMetricsArgsObjectSchema } from './SiteCountOutputTypeCountMetricsArgs.schema'

const makeSchema = () => z.object({
  calls: z.union([z.boolean(), z.lazy(() => SiteCountOutputTypeCountCallsArgsObjectSchema)]).optional(),
  callsRaw: z.union([z.boolean(), z.lazy(() => SiteCountOutputTypeCountCallsRawArgsObjectSchema)]).optional(),
  metrics: z.union([z.boolean(), z.lazy(() => SiteCountOutputTypeCountMetricsArgsObjectSchema)]).optional()
}).strict();
export const SiteCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.SiteCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.SiteCountOutputTypeSelect>;
export const SiteCountOutputTypeSelectObjectZodSchema = makeSchema();
