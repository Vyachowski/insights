import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteCreateWithoutMetricsInputObjectSchema as SiteCreateWithoutMetricsInputObjectSchema } from './SiteCreateWithoutMetricsInput.schema';
import { SiteUncheckedCreateWithoutMetricsInputObjectSchema as SiteUncheckedCreateWithoutMetricsInputObjectSchema } from './SiteUncheckedCreateWithoutMetricsInput.schema';
import { SiteCreateOrConnectWithoutMetricsInputObjectSchema as SiteCreateOrConnectWithoutMetricsInputObjectSchema } from './SiteCreateOrConnectWithoutMetricsInput.schema';
import { SiteWhereUniqueInputObjectSchema as SiteWhereUniqueInputObjectSchema } from './SiteWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => SiteCreateWithoutMetricsInputObjectSchema), z.lazy(() => SiteUncheckedCreateWithoutMetricsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => SiteCreateOrConnectWithoutMetricsInputObjectSchema).optional(),
  connect: z.lazy(() => SiteWhereUniqueInputObjectSchema).optional()
}).strict();
export const SiteCreateNestedOneWithoutMetricsInputObjectSchema: z.ZodType<Prisma.SiteCreateNestedOneWithoutMetricsInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteCreateNestedOneWithoutMetricsInput>;
export const SiteCreateNestedOneWithoutMetricsInputObjectZodSchema = makeSchema();
