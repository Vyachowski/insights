import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteMetricWhereUniqueInputObjectSchema as SiteMetricWhereUniqueInputObjectSchema } from './SiteMetricWhereUniqueInput.schema';
import { SiteMetricUpdateWithoutSiteInputObjectSchema as SiteMetricUpdateWithoutSiteInputObjectSchema } from './SiteMetricUpdateWithoutSiteInput.schema';
import { SiteMetricUncheckedUpdateWithoutSiteInputObjectSchema as SiteMetricUncheckedUpdateWithoutSiteInputObjectSchema } from './SiteMetricUncheckedUpdateWithoutSiteInput.schema';
import { SiteMetricCreateWithoutSiteInputObjectSchema as SiteMetricCreateWithoutSiteInputObjectSchema } from './SiteMetricCreateWithoutSiteInput.schema';
import { SiteMetricUncheckedCreateWithoutSiteInputObjectSchema as SiteMetricUncheckedCreateWithoutSiteInputObjectSchema } from './SiteMetricUncheckedCreateWithoutSiteInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => SiteMetricWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => SiteMetricUpdateWithoutSiteInputObjectSchema), z.lazy(() => SiteMetricUncheckedUpdateWithoutSiteInputObjectSchema)]),
  create: z.union([z.lazy(() => SiteMetricCreateWithoutSiteInputObjectSchema), z.lazy(() => SiteMetricUncheckedCreateWithoutSiteInputObjectSchema)])
}).strict();
export const SiteMetricUpsertWithWhereUniqueWithoutSiteInputObjectSchema: z.ZodType<Prisma.SiteMetricUpsertWithWhereUniqueWithoutSiteInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteMetricUpsertWithWhereUniqueWithoutSiteInput>;
export const SiteMetricUpsertWithWhereUniqueWithoutSiteInputObjectZodSchema = makeSchema();
