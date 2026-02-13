import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteCreateWithoutCallsImportInputObjectSchema as SiteCreateWithoutCallsImportInputObjectSchema } from './SiteCreateWithoutCallsImportInput.schema';
import { SiteUncheckedCreateWithoutCallsImportInputObjectSchema as SiteUncheckedCreateWithoutCallsImportInputObjectSchema } from './SiteUncheckedCreateWithoutCallsImportInput.schema';
import { SiteCreateOrConnectWithoutCallsImportInputObjectSchema as SiteCreateOrConnectWithoutCallsImportInputObjectSchema } from './SiteCreateOrConnectWithoutCallsImportInput.schema';
import { SiteUpsertWithoutCallsImportInputObjectSchema as SiteUpsertWithoutCallsImportInputObjectSchema } from './SiteUpsertWithoutCallsImportInput.schema';
import { SiteWhereUniqueInputObjectSchema as SiteWhereUniqueInputObjectSchema } from './SiteWhereUniqueInput.schema';
import { SiteUpdateToOneWithWhereWithoutCallsImportInputObjectSchema as SiteUpdateToOneWithWhereWithoutCallsImportInputObjectSchema } from './SiteUpdateToOneWithWhereWithoutCallsImportInput.schema';
import { SiteUpdateWithoutCallsImportInputObjectSchema as SiteUpdateWithoutCallsImportInputObjectSchema } from './SiteUpdateWithoutCallsImportInput.schema';
import { SiteUncheckedUpdateWithoutCallsImportInputObjectSchema as SiteUncheckedUpdateWithoutCallsImportInputObjectSchema } from './SiteUncheckedUpdateWithoutCallsImportInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => SiteCreateWithoutCallsImportInputObjectSchema), z.lazy(() => SiteUncheckedCreateWithoutCallsImportInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => SiteCreateOrConnectWithoutCallsImportInputObjectSchema).optional(),
  upsert: z.lazy(() => SiteUpsertWithoutCallsImportInputObjectSchema).optional(),
  connect: z.lazy(() => SiteWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => SiteUpdateToOneWithWhereWithoutCallsImportInputObjectSchema), z.lazy(() => SiteUpdateWithoutCallsImportInputObjectSchema), z.lazy(() => SiteUncheckedUpdateWithoutCallsImportInputObjectSchema)]).optional()
}).strict();
export const SiteUpdateOneRequiredWithoutCallsImportNestedInputObjectSchema: z.ZodType<Prisma.SiteUpdateOneRequiredWithoutCallsImportNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteUpdateOneRequiredWithoutCallsImportNestedInput>;
export const SiteUpdateOneRequiredWithoutCallsImportNestedInputObjectZodSchema = makeSchema();
