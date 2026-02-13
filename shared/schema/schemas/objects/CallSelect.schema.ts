import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteArgsObjectSchema as SiteArgsObjectSchema } from './SiteArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  siteId: z.boolean().optional(),
  gudokId: z.boolean().optional(),
  projectId: z.boolean().optional(),
  projectTitle: z.boolean().optional(),
  dst: z.boolean().optional(),
  advChannelId: z.boolean().optional(),
  advChannelName: z.boolean().optional(),
  src: z.boolean().optional(),
  duration: z.boolean().optional(),
  billsec: z.boolean().optional(),
  callstatus: z.boolean().optional(),
  date: z.boolean().optional(),
  region: z.boolean().optional(),
  callNumber: z.boolean().optional(),
  audio: z.boolean().optional(),
  source: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  site: z.union([z.boolean(), z.lazy(() => SiteArgsObjectSchema)]).optional()
}).strict();
export const CallSelectObjectSchema: z.ZodType<Prisma.CallSelect> = makeSchema() as unknown as z.ZodType<Prisma.CallSelect>;
export const CallSelectObjectZodSchema = makeSchema();
