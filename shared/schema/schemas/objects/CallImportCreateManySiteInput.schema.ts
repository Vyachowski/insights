import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';


const makeSchema = () => z.object({
  id: z.number().int().optional(),
  date: z.coerce.date(),
  src: z.string(),
  region: z.string().optional().nullable(),
  callNumber: z.number().int(),
  class: z.string().optional().nullable(),
  projectTitle: z.string(),
  advChannelName: z.string(),
  billsec: z.number().int(),
  comment: z.string().optional().nullable(),
  redirectNumber: z.string().optional().nullable(),
  source: z.string().optional(),
  importedAt: z.coerce.date().optional()
}).strict();
export const CallImportCreateManySiteInputObjectSchema: z.ZodType<Prisma.CallImportCreateManySiteInput> = makeSchema() as unknown as z.ZodType<Prisma.CallImportCreateManySiteInput>;
export const CallImportCreateManySiteInputObjectZodSchema = makeSchema();
