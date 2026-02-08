import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { CityCountOutputTypeSelectObjectSchema as CityCountOutputTypeSelectObjectSchema } from './CityCountOutputTypeSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => CityCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const CityCountOutputTypeArgsObjectSchema = makeSchema();
export const CityCountOutputTypeArgsObjectZodSchema = makeSchema();
