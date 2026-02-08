import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { CallSelectObjectSchema as CallSelectObjectSchema } from './CallSelect.schema';
import { CallIncludeObjectSchema as CallIncludeObjectSchema } from './CallInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => CallSelectObjectSchema).optional(),
  include: z.lazy(() => CallIncludeObjectSchema).optional()
}).strict();
export const CallArgsObjectSchema = makeSchema();
export const CallArgsObjectZodSchema = makeSchema();
