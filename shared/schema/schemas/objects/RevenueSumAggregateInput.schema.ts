import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  cityId: z.literal(true).optional(),
  amount: z.literal(true).optional()
}).strict();
export const RevenueSumAggregateInputObjectSchema: z.ZodType<Prisma.RevenueSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.RevenueSumAggregateInputType>;
export const RevenueSumAggregateInputObjectZodSchema = makeSchema();
