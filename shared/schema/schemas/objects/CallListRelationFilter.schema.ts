import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { CallWhereInputObjectSchema as CallWhereInputObjectSchema } from './CallWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => CallWhereInputObjectSchema).optional(),
  some: z.lazy(() => CallWhereInputObjectSchema).optional(),
  none: z.lazy(() => CallWhereInputObjectSchema).optional()
}).strict();
export const CallListRelationFilterObjectSchema: z.ZodType<Prisma.CallListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.CallListRelationFilter>;
export const CallListRelationFilterObjectZodSchema = makeSchema();
