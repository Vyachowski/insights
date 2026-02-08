import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteWhereUniqueInputObjectSchema as SiteWhereUniqueInputObjectSchema } from './SiteWhereUniqueInput.schema';
import { SiteCreateWithoutMetricsInputObjectSchema as SiteCreateWithoutMetricsInputObjectSchema } from './SiteCreateWithoutMetricsInput.schema';
import { SiteUncheckedCreateWithoutMetricsInputObjectSchema as SiteUncheckedCreateWithoutMetricsInputObjectSchema } from './SiteUncheckedCreateWithoutMetricsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => SiteWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => SiteCreateWithoutMetricsInputObjectSchema), z.lazy(() => SiteUncheckedCreateWithoutMetricsInputObjectSchema)])
}).strict();
export const SiteCreateOrConnectWithoutMetricsInputObjectSchema: z.ZodType<Prisma.SiteCreateOrConnectWithoutMetricsInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteCreateOrConnectWithoutMetricsInput>;
export const SiteCreateOrConnectWithoutMetricsInputObjectZodSchema = makeSchema();
