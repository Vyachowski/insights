import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteMetricCreateWithoutSiteInputObjectSchema as SiteMetricCreateWithoutSiteInputObjectSchema } from './SiteMetricCreateWithoutSiteInput.schema';
import { SiteMetricUncheckedCreateWithoutSiteInputObjectSchema as SiteMetricUncheckedCreateWithoutSiteInputObjectSchema } from './SiteMetricUncheckedCreateWithoutSiteInput.schema';
import { SiteMetricCreateOrConnectWithoutSiteInputObjectSchema as SiteMetricCreateOrConnectWithoutSiteInputObjectSchema } from './SiteMetricCreateOrConnectWithoutSiteInput.schema';
import { SiteMetricUpsertWithWhereUniqueWithoutSiteInputObjectSchema as SiteMetricUpsertWithWhereUniqueWithoutSiteInputObjectSchema } from './SiteMetricUpsertWithWhereUniqueWithoutSiteInput.schema';
import { SiteMetricCreateManySiteInputEnvelopeObjectSchema as SiteMetricCreateManySiteInputEnvelopeObjectSchema } from './SiteMetricCreateManySiteInputEnvelope.schema';
import { SiteMetricWhereUniqueInputObjectSchema as SiteMetricWhereUniqueInputObjectSchema } from './SiteMetricWhereUniqueInput.schema';
import { SiteMetricUpdateWithWhereUniqueWithoutSiteInputObjectSchema as SiteMetricUpdateWithWhereUniqueWithoutSiteInputObjectSchema } from './SiteMetricUpdateWithWhereUniqueWithoutSiteInput.schema';
import { SiteMetricUpdateManyWithWhereWithoutSiteInputObjectSchema as SiteMetricUpdateManyWithWhereWithoutSiteInputObjectSchema } from './SiteMetricUpdateManyWithWhereWithoutSiteInput.schema';
import { SiteMetricScalarWhereInputObjectSchema as SiteMetricScalarWhereInputObjectSchema } from './SiteMetricScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => SiteMetricCreateWithoutSiteInputObjectSchema), z.lazy(() => SiteMetricCreateWithoutSiteInputObjectSchema).array(), z.lazy(() => SiteMetricUncheckedCreateWithoutSiteInputObjectSchema), z.lazy(() => SiteMetricUncheckedCreateWithoutSiteInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => SiteMetricCreateOrConnectWithoutSiteInputObjectSchema), z.lazy(() => SiteMetricCreateOrConnectWithoutSiteInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => SiteMetricUpsertWithWhereUniqueWithoutSiteInputObjectSchema), z.lazy(() => SiteMetricUpsertWithWhereUniqueWithoutSiteInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => SiteMetricCreateManySiteInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => SiteMetricWhereUniqueInputObjectSchema), z.lazy(() => SiteMetricWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => SiteMetricWhereUniqueInputObjectSchema), z.lazy(() => SiteMetricWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => SiteMetricWhereUniqueInputObjectSchema), z.lazy(() => SiteMetricWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => SiteMetricWhereUniqueInputObjectSchema), z.lazy(() => SiteMetricWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => SiteMetricUpdateWithWhereUniqueWithoutSiteInputObjectSchema), z.lazy(() => SiteMetricUpdateWithWhereUniqueWithoutSiteInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => SiteMetricUpdateManyWithWhereWithoutSiteInputObjectSchema), z.lazy(() => SiteMetricUpdateManyWithWhereWithoutSiteInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => SiteMetricScalarWhereInputObjectSchema), z.lazy(() => SiteMetricScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const SiteMetricUpdateManyWithoutSiteNestedInputObjectSchema: z.ZodType<Prisma.SiteMetricUpdateManyWithoutSiteNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteMetricUpdateManyWithoutSiteNestedInput>;
export const SiteMetricUpdateManyWithoutSiteNestedInputObjectZodSchema = makeSchema();
