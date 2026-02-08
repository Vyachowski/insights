import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';


const makeSchema = () => z.object({
  id: z.number().int().optional()
}).strict();
export const RevenueWhereUniqueInputObjectSchema: z.ZodType<Prisma.RevenueWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.RevenueWhereUniqueInput>;
export const RevenueWhereUniqueInputObjectZodSchema = makeSchema();
