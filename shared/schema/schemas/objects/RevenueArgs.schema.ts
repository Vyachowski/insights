import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { RevenueSelectObjectSchema as RevenueSelectObjectSchema } from './RevenueSelect.schema';
import { RevenueIncludeObjectSchema as RevenueIncludeObjectSchema } from './RevenueInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => RevenueSelectObjectSchema).optional(),
  include: z.lazy(() => RevenueIncludeObjectSchema).optional()
}).strict();
export const RevenueArgsObjectSchema = makeSchema();
export const RevenueArgsObjectZodSchema = makeSchema();
