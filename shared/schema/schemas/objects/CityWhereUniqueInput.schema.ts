import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';


const makeSchema = () => z.object({
  id: z.number().int().optional()
}).strict();
export const CityWhereUniqueInputObjectSchema: z.ZodType<Prisma.CityWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.CityWhereUniqueInput>;
export const CityWhereUniqueInputObjectZodSchema = makeSchema();
