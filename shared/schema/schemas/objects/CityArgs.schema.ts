import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { CitySelectObjectSchema as CitySelectObjectSchema } from './CitySelect.schema';
import { CityIncludeObjectSchema as CityIncludeObjectSchema } from './CityInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => CitySelectObjectSchema).optional(),
  include: z.lazy(() => CityIncludeObjectSchema).optional()
}).strict();
export const CityArgsObjectSchema = makeSchema();
export const CityArgsObjectZodSchema = makeSchema();
