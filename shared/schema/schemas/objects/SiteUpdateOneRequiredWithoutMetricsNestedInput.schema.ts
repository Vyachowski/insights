import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteCreateWithoutMetricsInputObjectSchema as SiteCreateWithoutMetricsInputObjectSchema } from './SiteCreateWithoutMetricsInput.schema';
import { SiteUncheckedCreateWithoutMetricsInputObjectSchema as SiteUncheckedCreateWithoutMetricsInputObjectSchema } from './SiteUncheckedCreateWithoutMetricsInput.schema';
import { SiteCreateOrConnectWithoutMetricsInputObjectSchema as SiteCreateOrConnectWithoutMetricsInputObjectSchema } from './SiteCreateOrConnectWithoutMetricsInput.schema';
import { SiteUpsertWithoutMetricsInputObjectSchema as SiteUpsertWithoutMetricsInputObjectSchema } from './SiteUpsertWithoutMetricsInput.schema';
import { SiteWhereUniqueInputObjectSchema as SiteWhereUniqueInputObjectSchema } from './SiteWhereUniqueInput.schema';
import { SiteUpdateToOneWithWhereWithoutMetricsInputObjectSchema as SiteUpdateToOneWithWhereWithoutMetricsInputObjectSchema } from './SiteUpdateToOneWithWhereWithoutMetricsInput.schema';
import { SiteUpdateWithoutMetricsInputObjectSchema as SiteUpdateWithoutMetricsInputObjectSchema } from './SiteUpdateWithoutMetricsInput.schema';
import { SiteUncheckedUpdateWithoutMetricsInputObjectSchema as SiteUncheckedUpdateWithoutMetricsInputObjectSchema } from './SiteUncheckedUpdateWithoutMetricsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => SiteCreateWithoutMetricsInputObjectSchema), z.lazy(() => SiteUncheckedCreateWithoutMetricsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => SiteCreateOrConnectWithoutMetricsInputObjectSchema).optional(),
  upsert: z.lazy(() => SiteUpsertWithoutMetricsInputObjectSchema).optional(),
  connect: z.lazy(() => SiteWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => SiteUpdateToOneWithWhereWithoutMetricsInputObjectSchema), z.lazy(() => SiteUpdateWithoutMetricsInputObjectSchema), z.lazy(() => SiteUncheckedUpdateWithoutMetricsInputObjectSchema)]).optional()
}).strict();
export const SiteUpdateOneRequiredWithoutMetricsNestedInputObjectSchema: z.ZodType<Prisma.SiteUpdateOneRequiredWithoutMetricsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteUpdateOneRequiredWithoutMetricsNestedInput>;
export const SiteUpdateOneRequiredWithoutMetricsNestedInputObjectZodSchema = makeSchema();
