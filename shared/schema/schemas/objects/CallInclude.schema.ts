import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteArgsObjectSchema as SiteArgsObjectSchema } from './SiteArgs.schema'

const makeSchema = () => z.object({
  site: z.union([z.boolean(), z.lazy(() => SiteArgsObjectSchema)]).optional()
}).strict();
export const CallIncludeObjectSchema: z.ZodType<Prisma.CallInclude> = makeSchema() as unknown as z.ZodType<Prisma.CallInclude>;
export const CallIncludeObjectZodSchema = makeSchema();
