import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteUpdateWithoutCallsRawInputObjectSchema as SiteUpdateWithoutCallsRawInputObjectSchema } from './SiteUpdateWithoutCallsRawInput.schema';
import { SiteUncheckedUpdateWithoutCallsRawInputObjectSchema as SiteUncheckedUpdateWithoutCallsRawInputObjectSchema } from './SiteUncheckedUpdateWithoutCallsRawInput.schema';
import { SiteCreateWithoutCallsRawInputObjectSchema as SiteCreateWithoutCallsRawInputObjectSchema } from './SiteCreateWithoutCallsRawInput.schema';
import { SiteUncheckedCreateWithoutCallsRawInputObjectSchema as SiteUncheckedCreateWithoutCallsRawInputObjectSchema } from './SiteUncheckedCreateWithoutCallsRawInput.schema';
import { SiteWhereInputObjectSchema as SiteWhereInputObjectSchema } from './SiteWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => SiteUpdateWithoutCallsRawInputObjectSchema), z.lazy(() => SiteUncheckedUpdateWithoutCallsRawInputObjectSchema)]),
  create: z.union([z.lazy(() => SiteCreateWithoutCallsRawInputObjectSchema), z.lazy(() => SiteUncheckedCreateWithoutCallsRawInputObjectSchema)]),
  where: z.lazy(() => SiteWhereInputObjectSchema).optional()
}).strict();
export const SiteUpsertWithoutCallsRawInputObjectSchema: z.ZodType<Prisma.SiteUpsertWithoutCallsRawInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteUpsertWithoutCallsRawInput>;
export const SiteUpsertWithoutCallsRawInputObjectZodSchema = makeSchema();
