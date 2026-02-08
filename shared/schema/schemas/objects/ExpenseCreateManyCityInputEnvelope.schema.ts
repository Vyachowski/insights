import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { ExpenseCreateManyCityInputObjectSchema as ExpenseCreateManyCityInputObjectSchema } from './ExpenseCreateManyCityInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => ExpenseCreateManyCityInputObjectSchema), z.lazy(() => ExpenseCreateManyCityInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const ExpenseCreateManyCityInputEnvelopeObjectSchema: z.ZodType<Prisma.ExpenseCreateManyCityInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.ExpenseCreateManyCityInputEnvelope>;
export const ExpenseCreateManyCityInputEnvelopeObjectZodSchema = makeSchema();
