import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { CallCreateManySiteInputObjectSchema as CallCreateManySiteInputObjectSchema } from './CallCreateManySiteInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => CallCreateManySiteInputObjectSchema), z.lazy(() => CallCreateManySiteInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const CallCreateManySiteInputEnvelopeObjectSchema: z.ZodType<Prisma.CallCreateManySiteInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.CallCreateManySiteInputEnvelope>;
export const CallCreateManySiteInputEnvelopeObjectZodSchema = makeSchema();
