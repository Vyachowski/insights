import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { CallImportCreateManySiteInputObjectSchema as CallImportCreateManySiteInputObjectSchema } from './CallImportCreateManySiteInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => CallImportCreateManySiteInputObjectSchema), z.lazy(() => CallImportCreateManySiteInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const CallImportCreateManySiteInputEnvelopeObjectSchema: z.ZodType<Prisma.CallImportCreateManySiteInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.CallImportCreateManySiteInputEnvelope>;
export const CallImportCreateManySiteInputEnvelopeObjectZodSchema = makeSchema();
