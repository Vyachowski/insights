import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { RevenueCreateManyCityInputObjectSchema as RevenueCreateManyCityInputObjectSchema } from './RevenueCreateManyCityInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => RevenueCreateManyCityInputObjectSchema), z.lazy(() => RevenueCreateManyCityInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const RevenueCreateManyCityInputEnvelopeObjectSchema: z.ZodType<Prisma.RevenueCreateManyCityInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.RevenueCreateManyCityInputEnvelope>;
export const RevenueCreateManyCityInputEnvelopeObjectZodSchema = makeSchema();
