import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteWhereInputObjectSchema as SiteWhereInputObjectSchema } from './SiteWhereInput.schema';
import { SiteUpdateWithoutMetricsInputObjectSchema as SiteUpdateWithoutMetricsInputObjectSchema } from './SiteUpdateWithoutMetricsInput.schema';
import { SiteUncheckedUpdateWithoutMetricsInputObjectSchema as SiteUncheckedUpdateWithoutMetricsInputObjectSchema } from './SiteUncheckedUpdateWithoutMetricsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => SiteWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => SiteUpdateWithoutMetricsInputObjectSchema), z.lazy(() => SiteUncheckedUpdateWithoutMetricsInputObjectSchema)])
}).strict();
export const SiteUpdateToOneWithWhereWithoutMetricsInputObjectSchema: z.ZodType<Prisma.SiteUpdateToOneWithWhereWithoutMetricsInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteUpdateToOneWithWhereWithoutMetricsInput>;
export const SiteUpdateToOneWithWhereWithoutMetricsInputObjectZodSchema = makeSchema();
