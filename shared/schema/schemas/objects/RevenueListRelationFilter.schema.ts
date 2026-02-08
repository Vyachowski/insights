import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { RevenueWhereInputObjectSchema as RevenueWhereInputObjectSchema } from './RevenueWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => RevenueWhereInputObjectSchema).optional(),
  some: z.lazy(() => RevenueWhereInputObjectSchema).optional(),
  none: z.lazy(() => RevenueWhereInputObjectSchema).optional()
}).strict();
export const RevenueListRelationFilterObjectSchema: z.ZodType<Prisma.RevenueListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.RevenueListRelationFilter>;
export const RevenueListRelationFilterObjectZodSchema = makeSchema();
