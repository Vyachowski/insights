import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteMetricCreateManySiteInputObjectSchema as SiteMetricCreateManySiteInputObjectSchema } from './SiteMetricCreateManySiteInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => SiteMetricCreateManySiteInputObjectSchema), z.lazy(() => SiteMetricCreateManySiteInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const SiteMetricCreateManySiteInputEnvelopeObjectSchema: z.ZodType<Prisma.SiteMetricCreateManySiteInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.SiteMetricCreateManySiteInputEnvelope>;
export const SiteMetricCreateManySiteInputEnvelopeObjectZodSchema = makeSchema();
