import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';


const makeSchema = () => z.object({
  id: z.number().int().optional()
}).strict();
export const ExpenseWhereUniqueInputObjectSchema: z.ZodType<Prisma.ExpenseWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.ExpenseWhereUniqueInput>;
export const ExpenseWhereUniqueInputObjectZodSchema = makeSchema();
