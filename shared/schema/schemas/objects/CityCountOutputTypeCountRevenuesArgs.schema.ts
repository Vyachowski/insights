import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { RevenueWhereInputObjectSchema as RevenueWhereInputObjectSchema } from './RevenueWhereInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => RevenueWhereInputObjectSchema).optional()
}).strict();
export const CityCountOutputTypeCountRevenuesArgsObjectSchema = makeSchema();
export const CityCountOutputTypeCountRevenuesArgsObjectZodSchema = makeSchema();
