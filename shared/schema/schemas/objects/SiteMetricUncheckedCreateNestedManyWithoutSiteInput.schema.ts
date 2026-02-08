import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteMetricCreateWithoutSiteInputObjectSchema as SiteMetricCreateWithoutSiteInputObjectSchema } from './SiteMetricCreateWithoutSiteInput.schema';
import { SiteMetricUncheckedCreateWithoutSiteInputObjectSchema as SiteMetricUncheckedCreateWithoutSiteInputObjectSchema } from './SiteMetricUncheckedCreateWithoutSiteInput.schema';
import { SiteMetricCreateOrConnectWithoutSiteInputObjectSchema as SiteMetricCreateOrConnectWithoutSiteInputObjectSchema } from './SiteMetricCreateOrConnectWithoutSiteInput.schema';
import { SiteMetricCreateManySiteInputEnvelopeObjectSchema as SiteMetricCreateManySiteInputEnvelopeObjectSchema } from './SiteMetricCreateManySiteInputEnvelope.schema';
import { SiteMetricWhereUniqueInputObjectSchema as SiteMetricWhereUniqueInputObjectSchema } from './SiteMetricWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => SiteMetricCreateWithoutSiteInputObjectSchema), z.lazy(() => SiteMetricCreateWithoutSiteInputObjectSchema).array(), z.lazy(() => SiteMetricUncheckedCreateWithoutSiteInputObjectSchema), z.lazy(() => SiteMetricUncheckedCreateWithoutSiteInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => SiteMetricCreateOrConnectWithoutSiteInputObjectSchema), z.lazy(() => SiteMetricCreateOrConnectWithoutSiteInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => SiteMetricCreateManySiteInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => SiteMetricWhereUniqueInputObjectSchema), z.lazy(() => SiteMetricWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const SiteMetricUncheckedCreateNestedManyWithoutSiteInputObjectSchema: z.ZodType<Prisma.SiteMetricUncheckedCreateNestedManyWithoutSiteInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteMetricUncheckedCreateNestedManyWithoutSiteInput>;
export const SiteMetricUncheckedCreateNestedManyWithoutSiteInputObjectZodSchema = makeSchema();
