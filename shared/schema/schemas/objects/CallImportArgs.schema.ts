import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { CallImportSelectObjectSchema as CallImportSelectObjectSchema } from './CallImportSelect.schema';
import { CallImportIncludeObjectSchema as CallImportIncludeObjectSchema } from './CallImportInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => CallImportSelectObjectSchema).optional(),
  include: z.lazy(() => CallImportIncludeObjectSchema).optional()
}).strict();
export const CallImportArgsObjectSchema = makeSchema();
export const CallImportArgsObjectZodSchema = makeSchema();
