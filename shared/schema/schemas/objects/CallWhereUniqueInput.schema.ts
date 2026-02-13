import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';


const makeSchema = () => z.object({
  id: z.number().int().optional(),
  gudokId: z.number().int().optional()
}).strict();
export const CallWhereUniqueInputObjectSchema: z.ZodType<Prisma.CallWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.CallWhereUniqueInput>;
export const CallWhereUniqueInputObjectZodSchema = makeSchema();
