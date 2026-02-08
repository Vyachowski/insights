import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteCountOutputTypeSelectObjectSchema as SiteCountOutputTypeSelectObjectSchema } from './SiteCountOutputTypeSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => SiteCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const SiteCountOutputTypeArgsObjectSchema = makeSchema();
export const SiteCountOutputTypeArgsObjectZodSchema = makeSchema();
