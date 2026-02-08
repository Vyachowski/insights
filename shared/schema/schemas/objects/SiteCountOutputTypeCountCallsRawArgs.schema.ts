import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { CallImportWhereInputObjectSchema as CallImportWhereInputObjectSchema } from './CallImportWhereInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CallImportWhereInputObjectSchema).optional()
}).strict();
export const SiteCountOutputTypeCountCallsRawArgsObjectSchema = makeSchema();
export const SiteCountOutputTypeCountCallsRawArgsObjectZodSchema = makeSchema();
