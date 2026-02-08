import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { CallImportWhereInputObjectSchema as CallImportWhereInputObjectSchema } from './CallImportWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => CallImportWhereInputObjectSchema).optional(),
  some: z.lazy(() => CallImportWhereInputObjectSchema).optional(),
  none: z.lazy(() => CallImportWhereInputObjectSchema).optional()
}).strict();
export const CallImportListRelationFilterObjectSchema: z.ZodType<Prisma.CallImportListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.CallImportListRelationFilter>;
export const CallImportListRelationFilterObjectZodSchema = makeSchema();
