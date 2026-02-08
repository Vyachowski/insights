import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteCreateWithoutCallsRawInputObjectSchema as SiteCreateWithoutCallsRawInputObjectSchema } from './SiteCreateWithoutCallsRawInput.schema';
import { SiteUncheckedCreateWithoutCallsRawInputObjectSchema as SiteUncheckedCreateWithoutCallsRawInputObjectSchema } from './SiteUncheckedCreateWithoutCallsRawInput.schema';
import { SiteCreateOrConnectWithoutCallsRawInputObjectSchema as SiteCreateOrConnectWithoutCallsRawInputObjectSchema } from './SiteCreateOrConnectWithoutCallsRawInput.schema';
import { SiteUpsertWithoutCallsRawInputObjectSchema as SiteUpsertWithoutCallsRawInputObjectSchema } from './SiteUpsertWithoutCallsRawInput.schema';
import { SiteWhereUniqueInputObjectSchema as SiteWhereUniqueInputObjectSchema } from './SiteWhereUniqueInput.schema';
import { SiteUpdateToOneWithWhereWithoutCallsRawInputObjectSchema as SiteUpdateToOneWithWhereWithoutCallsRawInputObjectSchema } from './SiteUpdateToOneWithWhereWithoutCallsRawInput.schema';
import { SiteUpdateWithoutCallsRawInputObjectSchema as SiteUpdateWithoutCallsRawInputObjectSchema } from './SiteUpdateWithoutCallsRawInput.schema';
import { SiteUncheckedUpdateWithoutCallsRawInputObjectSchema as SiteUncheckedUpdateWithoutCallsRawInputObjectSchema } from './SiteUncheckedUpdateWithoutCallsRawInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => SiteCreateWithoutCallsRawInputObjectSchema), z.lazy(() => SiteUncheckedCreateWithoutCallsRawInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => SiteCreateOrConnectWithoutCallsRawInputObjectSchema).optional(),
  upsert: z.lazy(() => SiteUpsertWithoutCallsRawInputObjectSchema).optional(),
  connect: z.lazy(() => SiteWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => SiteUpdateToOneWithWhereWithoutCallsRawInputObjectSchema), z.lazy(() => SiteUpdateWithoutCallsRawInputObjectSchema), z.lazy(() => SiteUncheckedUpdateWithoutCallsRawInputObjectSchema)]).optional()
}).strict();
export const SiteUpdateOneRequiredWithoutCallsRawNestedInputObjectSchema: z.ZodType<Prisma.SiteUpdateOneRequiredWithoutCallsRawNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteUpdateOneRequiredWithoutCallsRawNestedInput>;
export const SiteUpdateOneRequiredWithoutCallsRawNestedInputObjectZodSchema = makeSchema();
