import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteCreateNestedOneWithoutCallsRawInputObjectSchema as SiteCreateNestedOneWithoutCallsRawInputObjectSchema } from './SiteCreateNestedOneWithoutCallsRawInput.schema'

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
  imported_at: z.coerce.date().optional(),
  site: z.lazy(() => SiteCreateNestedOneWithoutCallsRawInputObjectSchema)
}).strict();
export const CallImportCreateInputObjectSchema: z.ZodType<Prisma.CallImportCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.CallImportCreateInput>;
export const CallImportCreateInputObjectZodSchema = makeSchema();
