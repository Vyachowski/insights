import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { CallWhereInputObjectSchema as CallWhereInputObjectSchema } from './CallWhereInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CallWhereInputObjectSchema).optional()
}).strict();
export const SiteCountOutputTypeCountCallsArgsObjectSchema = makeSchema();
export const SiteCountOutputTypeCountCallsArgsObjectZodSchema = makeSchema();
