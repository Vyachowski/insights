import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  siteId: z.literal(true).optional(),
  date: z.literal(true).optional(),
  src: z.literal(true).optional(),
  region: z.literal(true).optional(),
  callNumber: z.literal(true).optional(),
  class: z.literal(true).optional(),
  projectTitle: z.literal(true).optional(),
  advChannelName: z.literal(true).optional(),
  billsec: z.literal(true).optional(),
  comment: z.literal(true).optional(),
  redirectNumber: z.literal(true).optional(),
  source: z.literal(true).optional(),
  importedAt: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const CallImportCountAggregateInputObjectSchema: z.ZodType<Prisma.CallImportCountAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.CallImportCountAggregateInputType>;
export const CallImportCountAggregateInputObjectZodSchema = makeSchema();
