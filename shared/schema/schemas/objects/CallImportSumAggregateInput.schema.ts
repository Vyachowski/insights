import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  siteId: z.literal(true).optional(),
  callNumber: z.literal(true).optional(),
  billsec: z.literal(true).optional()
}).strict();
export const CallImportSumAggregateInputObjectSchema: z.ZodType<Prisma.CallImportSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.CallImportSumAggregateInputType>;
export const CallImportSumAggregateInputObjectZodSchema = makeSchema();
