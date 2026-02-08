import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';


const makeSchema = () => z.object({
  date: z.coerce.date(),
  src: z.string(),
  region: z.string().optional().nullable(),
  call_number: z.number().int(),
  class: z.string().optional().nullable(),
  project_title: z.string(),
  adv_channel_name: z.string(),
  billsec: z.number().int(),
  comment: z.string().optional().nullable(),
  redirect_number: z.string().optional().nullable(),
  source: z.string().optional(),
  imported_at: z.coerce.date().optional()
}).strict();
export const CallImportCreateWithoutSiteInputObjectSchema: z.ZodType<Prisma.CallImportCreateWithoutSiteInput> = makeSchema() as unknown as z.ZodType<Prisma.CallImportCreateWithoutSiteInput>;
export const CallImportCreateWithoutSiteInputObjectZodSchema = makeSchema();
