import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteArgsObjectSchema as SiteArgsObjectSchema } from './SiteArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  site_id: z.boolean().optional(),
  date: z.boolean().optional(),
  src: z.boolean().optional(),
  region: z.boolean().optional(),
  call_number: z.boolean().optional(),
  class: z.boolean().optional(),
  project_title: z.boolean().optional(),
  adv_channel_name: z.boolean().optional(),
  billsec: z.boolean().optional(),
  comment: z.boolean().optional(),
  redirect_number: z.boolean().optional(),
  source: z.boolean().optional(),
  imported_at: z.boolean().optional(),
  site: z.union([z.boolean(), z.lazy(() => SiteArgsObjectSchema)]).optional()
}).strict();
export const CallImportSelectObjectSchema: z.ZodType<Prisma.CallImportSelect> = makeSchema() as unknown as z.ZodType<Prisma.CallImportSelect>;
export const CallImportSelectObjectZodSchema = makeSchema();
