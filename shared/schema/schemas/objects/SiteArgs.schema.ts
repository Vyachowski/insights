import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteSelectObjectSchema as SiteSelectObjectSchema } from './SiteSelect.schema';
import { SiteIncludeObjectSchema as SiteIncludeObjectSchema } from './SiteInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => SiteSelectObjectSchema).optional(),
  include: z.lazy(() => SiteIncludeObjectSchema).optional()
}).strict();
export const SiteArgsObjectSchema = makeSchema();
export const SiteArgsObjectZodSchema = makeSchema();
