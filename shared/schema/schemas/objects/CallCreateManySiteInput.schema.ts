import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';


const makeSchema = () => z.object({
  id: z.number().int().optional(),
  gudokId: z.number().int(),
  projectId: z.number().int(),
  projectTitle: z.string(),
  dst: z.string(),
  advChannelId: z.string(),
  advChannelName: z.string(),
  src: z.string(),
  duration: z.number().int(),
  billsec: z.number().int(),
  callstatus: z.string(),
  date: z.coerce.date(),
  region: z.string(),
  callNumber: z.number().int(),
  audio: z.string(),
  source: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const CallCreateManySiteInputObjectSchema: z.ZodType<Prisma.CallCreateManySiteInput> = makeSchema() as unknown as z.ZodType<Prisma.CallCreateManySiteInput>;
export const CallCreateManySiteInputObjectZodSchema = makeSchema();
