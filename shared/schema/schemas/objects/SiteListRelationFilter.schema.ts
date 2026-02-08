import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteWhereInputObjectSchema as SiteWhereInputObjectSchema } from './SiteWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => SiteWhereInputObjectSchema).optional(),
  some: z.lazy(() => SiteWhereInputObjectSchema).optional(),
  none: z.lazy(() => SiteWhereInputObjectSchema).optional()
}).strict();
export const SiteListRelationFilterObjectSchema: z.ZodType<Prisma.SiteListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.SiteListRelationFilter>;
export const SiteListRelationFilterObjectZodSchema = makeSchema();
