import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteWhereInputObjectSchema as SiteWhereInputObjectSchema } from './SiteWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => SiteWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => SiteWhereInputObjectSchema).optional()
}).strict();
export const SiteScalarRelationFilterObjectSchema: z.ZodType<Prisma.SiteScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.SiteScalarRelationFilter>;
export const SiteScalarRelationFilterObjectZodSchema = makeSchema();
