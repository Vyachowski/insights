import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteCreateManyCityInputObjectSchema as SiteCreateManyCityInputObjectSchema } from './SiteCreateManyCityInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => SiteCreateManyCityInputObjectSchema), z.lazy(() => SiteCreateManyCityInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const SiteCreateManyCityInputEnvelopeObjectSchema: z.ZodType<Prisma.SiteCreateManyCityInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.SiteCreateManyCityInputEnvelope>;
export const SiteCreateManyCityInputEnvelopeObjectZodSchema = makeSchema();
