import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  site_id: z.literal(true).optional(),
  gudok_id: z.literal(true).optional(),
  project_id: z.literal(true).optional(),
  project_title: z.literal(true).optional(),
  dst: z.literal(true).optional(),
  adv_channel_id: z.literal(true).optional(),
  adv_channel_name: z.literal(true).optional(),
  src: z.literal(true).optional(),
  duration: z.literal(true).optional(),
  billsec: z.literal(true).optional(),
  callstatus: z.literal(true).optional(),
  date: z.literal(true).optional(),
  region: z.literal(true).optional(),
  call_number: z.literal(true).optional(),
  audio: z.literal(true).optional(),
  source: z.literal(true).optional(),
  created_at: z.literal(true).optional(),
  updated_at: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const CallCountAggregateInputObjectSchema: z.ZodType<Prisma.CallCountAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.CallCountAggregateInputType>;
export const CallCountAggregateInputObjectZodSchema = makeSchema();
