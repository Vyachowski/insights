import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteArgsObjectSchema as SiteArgsObjectSchema } from './SiteArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  siteId: z.boolean().optional(),
  date: z.boolean().optional(),
  src: z.boolean().optional(),
  region: z.boolean().optional(),
  callNumber: z.boolean().optional(),
  class: z.boolean().optional(),
  projectTitle: z.boolean().optional(),
  advChannelName: z.boolean().optional(),
  billsec: z.boolean().optional(),
  comment: z.boolean().optional(),
  redirectNumber: z.boolean().optional(),
  source: z.boolean().optional(),
  importedAt: z.boolean().optional(),
  site: z.union([z.boolean(), z.lazy(() => SiteArgsObjectSchema)]).optional()
}).strict();
export const CallImportSelectObjectSchema: z.ZodType<Prisma.CallImportSelect> = makeSchema() as unknown as z.ZodType<Prisma.CallImportSelect>;
export const CallImportSelectObjectZodSchema = makeSchema();
