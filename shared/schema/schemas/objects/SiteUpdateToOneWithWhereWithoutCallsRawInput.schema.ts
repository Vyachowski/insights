import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteWhereInputObjectSchema as SiteWhereInputObjectSchema } from './SiteWhereInput.schema';
import { SiteUpdateWithoutCallsRawInputObjectSchema as SiteUpdateWithoutCallsRawInputObjectSchema } from './SiteUpdateWithoutCallsRawInput.schema';
import { SiteUncheckedUpdateWithoutCallsRawInputObjectSchema as SiteUncheckedUpdateWithoutCallsRawInputObjectSchema } from './SiteUncheckedUpdateWithoutCallsRawInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => SiteWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => SiteUpdateWithoutCallsRawInputObjectSchema), z.lazy(() => SiteUncheckedUpdateWithoutCallsRawInputObjectSchema)])
}).strict();
export const SiteUpdateToOneWithWhereWithoutCallsRawInputObjectSchema: z.ZodType<Prisma.SiteUpdateToOneWithWhereWithoutCallsRawInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteUpdateToOneWithWhereWithoutCallsRawInput>;
export const SiteUpdateToOneWithWhereWithoutCallsRawInputObjectZodSchema = makeSchema();
