import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteCreateNestedOneWithoutCallsImportInputObjectSchema as SiteCreateNestedOneWithoutCallsImportInputObjectSchema } from './SiteCreateNestedOneWithoutCallsImportInput.schema'

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
  importedAt: z.coerce.date().optional(),
  site: z.lazy(() => SiteCreateNestedOneWithoutCallsImportInputObjectSchema)
}).strict();
export const CallImportCreateInputObjectSchema: z.ZodType<Prisma.CallImportCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.CallImportCreateInput>;
export const CallImportCreateInputObjectZodSchema = makeSchema();
