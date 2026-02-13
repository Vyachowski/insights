import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';


const makeSchema = () => z.object({
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
export const CallImportCreateWithoutSiteInputObjectSchema: z.ZodType<Prisma.CallImportCreateWithoutSiteInput> = makeSchema() as unknown as z.ZodType<Prisma.CallImportCreateWithoutSiteInput>;
export const CallImportCreateWithoutSiteInputObjectZodSchema = makeSchema();
