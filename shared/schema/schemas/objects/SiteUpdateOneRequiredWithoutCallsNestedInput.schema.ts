import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteCreateWithoutCallsInputObjectSchema as SiteCreateWithoutCallsInputObjectSchema } from './SiteCreateWithoutCallsInput.schema';
import { SiteUncheckedCreateWithoutCallsInputObjectSchema as SiteUncheckedCreateWithoutCallsInputObjectSchema } from './SiteUncheckedCreateWithoutCallsInput.schema';
import { SiteCreateOrConnectWithoutCallsInputObjectSchema as SiteCreateOrConnectWithoutCallsInputObjectSchema } from './SiteCreateOrConnectWithoutCallsInput.schema';
import { SiteUpsertWithoutCallsInputObjectSchema as SiteUpsertWithoutCallsInputObjectSchema } from './SiteUpsertWithoutCallsInput.schema';
import { SiteWhereUniqueInputObjectSchema as SiteWhereUniqueInputObjectSchema } from './SiteWhereUniqueInput.schema';
import { SiteUpdateToOneWithWhereWithoutCallsInputObjectSchema as SiteUpdateToOneWithWhereWithoutCallsInputObjectSchema } from './SiteUpdateToOneWithWhereWithoutCallsInput.schema';
import { SiteUpdateWithoutCallsInputObjectSchema as SiteUpdateWithoutCallsInputObjectSchema } from './SiteUpdateWithoutCallsInput.schema';
import { SiteUncheckedUpdateWithoutCallsInputObjectSchema as SiteUncheckedUpdateWithoutCallsInputObjectSchema } from './SiteUncheckedUpdateWithoutCallsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => SiteCreateWithoutCallsInputObjectSchema), z.lazy(() => SiteUncheckedCreateWithoutCallsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => SiteCreateOrConnectWithoutCallsInputObjectSchema).optional(),
  upsert: z.lazy(() => SiteUpsertWithoutCallsInputObjectSchema).optional(),
  connect: z.lazy(() => SiteWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => SiteUpdateToOneWithWhereWithoutCallsInputObjectSchema), z.lazy(() => SiteUpdateWithoutCallsInputObjectSchema), z.lazy(() => SiteUncheckedUpdateWithoutCallsInputObjectSchema)]).optional()
}).strict();
export const SiteUpdateOneRequiredWithoutCallsNestedInputObjectSchema: z.ZodType<Prisma.SiteUpdateOneRequiredWithoutCallsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteUpdateOneRequiredWithoutCallsNestedInput>;
export const SiteUpdateOneRequiredWithoutCallsNestedInputObjectZodSchema = makeSchema();
