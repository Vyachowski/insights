import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  site_id: z.literal(true).optional(),
  date: z.literal(true).optional(),
  src: z.literal(true).optional(),
  region: z.literal(true).optional(),
  call_number: z.literal(true).optional(),
  class: z.literal(true).optional(),
  project_title: z.literal(true).optional(),
  adv_channel_name: z.literal(true).optional(),
  billsec: z.literal(true).optional(),
  comment: z.literal(true).optional(),
  redirect_number: z.literal(true).optional(),
  source: z.literal(true).optional(),
  imported_at: z.literal(true).optional()
}).strict();
export const CallImportMinAggregateInputObjectSchema: z.ZodType<Prisma.CallImportMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.CallImportMinAggregateInputType>;
export const CallImportMinAggregateInputObjectZodSchema = makeSchema();
