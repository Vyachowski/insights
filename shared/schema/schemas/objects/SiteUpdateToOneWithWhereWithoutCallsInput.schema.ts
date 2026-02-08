import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteWhereInputObjectSchema as SiteWhereInputObjectSchema } from './SiteWhereInput.schema';
import { SiteUpdateWithoutCallsInputObjectSchema as SiteUpdateWithoutCallsInputObjectSchema } from './SiteUpdateWithoutCallsInput.schema';
import { SiteUncheckedUpdateWithoutCallsInputObjectSchema as SiteUncheckedUpdateWithoutCallsInputObjectSchema } from './SiteUncheckedUpdateWithoutCallsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => SiteWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => SiteUpdateWithoutCallsInputObjectSchema), z.lazy(() => SiteUncheckedUpdateWithoutCallsInputObjectSchema)])
}).strict();
export const SiteUpdateToOneWithWhereWithoutCallsInputObjectSchema: z.ZodType<Prisma.SiteUpdateToOneWithWhereWithoutCallsInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteUpdateToOneWithWhereWithoutCallsInput>;
export const SiteUpdateToOneWithWhereWithoutCallsInputObjectZodSchema = makeSchema();
