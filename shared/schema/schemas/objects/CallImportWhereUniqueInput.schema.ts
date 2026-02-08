import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';


const makeSchema = () => z.object({
  id: z.number().int().optional()
}).strict();
export const CallImportWhereUniqueInputObjectSchema: z.ZodType<Prisma.CallImportWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.CallImportWhereUniqueInput>;
export const CallImportWhereUniqueInputObjectZodSchema = makeSchema();
