import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';


const makeSchema = () => z.object({
  id: z.number().int().optional()
}).strict();
export const SiteWhereUniqueInputObjectSchema: z.ZodType<Prisma.SiteWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteWhereUniqueInput>;
export const SiteWhereUniqueInputObjectZodSchema = makeSchema();
