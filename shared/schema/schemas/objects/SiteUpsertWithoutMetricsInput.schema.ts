import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteUpdateWithoutMetricsInputObjectSchema as SiteUpdateWithoutMetricsInputObjectSchema } from './SiteUpdateWithoutMetricsInput.schema';
import { SiteUncheckedUpdateWithoutMetricsInputObjectSchema as SiteUncheckedUpdateWithoutMetricsInputObjectSchema } from './SiteUncheckedUpdateWithoutMetricsInput.schema';
import { SiteCreateWithoutMetricsInputObjectSchema as SiteCreateWithoutMetricsInputObjectSchema } from './SiteCreateWithoutMetricsInput.schema';
import { SiteUncheckedCreateWithoutMetricsInputObjectSchema as SiteUncheckedCreateWithoutMetricsInputObjectSchema } from './SiteUncheckedCreateWithoutMetricsInput.schema';
import { SiteWhereInputObjectSchema as SiteWhereInputObjectSchema } from './SiteWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => SiteUpdateWithoutMetricsInputObjectSchema), z.lazy(() => SiteUncheckedUpdateWithoutMetricsInputObjectSchema)]),
  create: z.union([z.lazy(() => SiteCreateWithoutMetricsInputObjectSchema), z.lazy(() => SiteUncheckedCreateWithoutMetricsInputObjectSchema)]),
  where: z.lazy(() => SiteWhereInputObjectSchema).optional()
}).strict();
export const SiteUpsertWithoutMetricsInputObjectSchema: z.ZodType<Prisma.SiteUpsertWithoutMetricsInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteUpsertWithoutMetricsInput>;
export const SiteUpsertWithoutMetricsInputObjectZodSchema = makeSchema();
