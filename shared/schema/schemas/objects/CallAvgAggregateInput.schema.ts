import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  siteId: z.literal(true).optional(),
  gudokId: z.literal(true).optional(),
  projectId: z.literal(true).optional(),
  duration: z.literal(true).optional(),
  billsec: z.literal(true).optional(),
  callNumber: z.literal(true).optional()
}).strict();
export const CallAvgAggregateInputObjectSchema: z.ZodType<Prisma.CallAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.CallAvgAggregateInputType>;
export const CallAvgAggregateInputObjectZodSchema = makeSchema();
