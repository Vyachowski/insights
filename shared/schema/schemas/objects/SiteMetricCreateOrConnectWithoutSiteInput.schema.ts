import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteMetricWhereUniqueInputObjectSchema as SiteMetricWhereUniqueInputObjectSchema } from './SiteMetricWhereUniqueInput.schema';
import { SiteMetricCreateWithoutSiteInputObjectSchema as SiteMetricCreateWithoutSiteInputObjectSchema } from './SiteMetricCreateWithoutSiteInput.schema';
import { SiteMetricUncheckedCreateWithoutSiteInputObjectSchema as SiteMetricUncheckedCreateWithoutSiteInputObjectSchema } from './SiteMetricUncheckedCreateWithoutSiteInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => SiteMetricWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => SiteMetricCreateWithoutSiteInputObjectSchema), z.lazy(() => SiteMetricUncheckedCreateWithoutSiteInputObjectSchema)])
}).strict();
export const SiteMetricCreateOrConnectWithoutSiteInputObjectSchema: z.ZodType<Prisma.SiteMetricCreateOrConnectWithoutSiteInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteMetricCreateOrConnectWithoutSiteInput>;
export const SiteMetricCreateOrConnectWithoutSiteInputObjectZodSchema = makeSchema();
