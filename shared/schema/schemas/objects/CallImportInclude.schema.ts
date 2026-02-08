import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteArgsObjectSchema as SiteArgsObjectSchema } from './SiteArgs.schema'

const makeSchema = () => z.object({
  site: z.union([z.boolean(), z.lazy(() => SiteArgsObjectSchema)]).optional()
}).strict();
export const CallImportIncludeObjectSchema: z.ZodType<Prisma.CallImportInclude> = makeSchema() as unknown as z.ZodType<Prisma.CallImportInclude>;
export const CallImportIncludeObjectZodSchema = makeSchema();
