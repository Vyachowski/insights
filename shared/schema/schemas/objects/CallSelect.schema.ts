import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteArgsObjectSchema as SiteArgsObjectSchema } from './SiteArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  site_id: z.boolean().optional(),
  gudok_id: z.boolean().optional(),
  project_id: z.boolean().optional(),
  project_title: z.boolean().optional(),
  dst: z.boolean().optional(),
  adv_channel_id: z.boolean().optional(),
  adv_channel_name: z.boolean().optional(),
  src: z.boolean().optional(),
  duration: z.boolean().optional(),
  billsec: z.boolean().optional(),
  callstatus: z.boolean().optional(),
  date: z.boolean().optional(),
  region: z.boolean().optional(),
  call_number: z.boolean().optional(),
  audio: z.boolean().optional(),
  source: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  site: z.union([z.boolean(), z.lazy(() => SiteArgsObjectSchema)]).optional()
}).strict();
export const CallSelectObjectSchema: z.ZodType<Prisma.CallSelect> = makeSchema() as unknown as z.ZodType<Prisma.CallSelect>;
export const CallSelectObjectZodSchema = makeSchema();
