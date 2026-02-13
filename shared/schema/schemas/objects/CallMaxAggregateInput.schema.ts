import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  siteId: z.literal(true).optional(),
  gudokId: z.literal(true).optional(),
  projectId: z.literal(true).optional(),
  projectTitle: z.literal(true).optional(),
  dst: z.literal(true).optional(),
  advChannelId: z.literal(true).optional(),
  advChannelName: z.literal(true).optional(),
  src: z.literal(true).optional(),
  duration: z.literal(true).optional(),
  billsec: z.literal(true).optional(),
  callstatus: z.literal(true).optional(),
  date: z.literal(true).optional(),
  region: z.literal(true).optional(),
  callNumber: z.literal(true).optional(),
  audio: z.literal(true).optional(),
  source: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const CallMaxAggregateInputObjectSchema: z.ZodType<Prisma.CallMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.CallMaxAggregateInputType>;
export const CallMaxAggregateInputObjectZodSchema = makeSchema();
