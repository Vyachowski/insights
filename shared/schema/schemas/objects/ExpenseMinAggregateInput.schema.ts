import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  cityId: z.literal(true).optional(),
  date: z.literal(true).optional(),
  amount: z.literal(true).optional(),
  type: z.literal(true).optional(),
  comment: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const ExpenseMinAggregateInputObjectSchema: z.ZodType<Prisma.ExpenseMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.ExpenseMinAggregateInputType>;
export const ExpenseMinAggregateInputObjectZodSchema = makeSchema();
