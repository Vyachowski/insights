import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteWhereInputObjectSchema as SiteWhereInputObjectSchema } from './SiteWhereInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => SiteWhereInputObjectSchema).optional()
}).strict();
export const CityCountOutputTypeCountSitesArgsObjectSchema = makeSchema();
export const CityCountOutputTypeCountSitesArgsObjectZodSchema = makeSchema();
