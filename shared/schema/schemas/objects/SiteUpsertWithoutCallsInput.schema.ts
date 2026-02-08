import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteUpdateWithoutCallsInputObjectSchema as SiteUpdateWithoutCallsInputObjectSchema } from './SiteUpdateWithoutCallsInput.schema';
import { SiteUncheckedUpdateWithoutCallsInputObjectSchema as SiteUncheckedUpdateWithoutCallsInputObjectSchema } from './SiteUncheckedUpdateWithoutCallsInput.schema';
import { SiteCreateWithoutCallsInputObjectSchema as SiteCreateWithoutCallsInputObjectSchema } from './SiteCreateWithoutCallsInput.schema';
import { SiteUncheckedCreateWithoutCallsInputObjectSchema as SiteUncheckedCreateWithoutCallsInputObjectSchema } from './SiteUncheckedCreateWithoutCallsInput.schema';
import { SiteWhereInputObjectSchema as SiteWhereInputObjectSchema } from './SiteWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => SiteUpdateWithoutCallsInputObjectSchema), z.lazy(() => SiteUncheckedUpdateWithoutCallsInputObjectSchema)]),
  create: z.union([z.lazy(() => SiteCreateWithoutCallsInputObjectSchema), z.lazy(() => SiteUncheckedCreateWithoutCallsInputObjectSchema)]),
  where: z.lazy(() => SiteWhereInputObjectSchema).optional()
}).strict();
export const SiteUpsertWithoutCallsInputObjectSchema: z.ZodType<Prisma.SiteUpsertWithoutCallsInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteUpsertWithoutCallsInput>;
export const SiteUpsertWithoutCallsInputObjectZodSchema = makeSchema();
