import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteUpdateWithoutCallsImportInputObjectSchema as SiteUpdateWithoutCallsImportInputObjectSchema } from './SiteUpdateWithoutCallsImportInput.schema';
import { SiteUncheckedUpdateWithoutCallsImportInputObjectSchema as SiteUncheckedUpdateWithoutCallsImportInputObjectSchema } from './SiteUncheckedUpdateWithoutCallsImportInput.schema';
import { SiteCreateWithoutCallsImportInputObjectSchema as SiteCreateWithoutCallsImportInputObjectSchema } from './SiteCreateWithoutCallsImportInput.schema';
import { SiteUncheckedCreateWithoutCallsImportInputObjectSchema as SiteUncheckedCreateWithoutCallsImportInputObjectSchema } from './SiteUncheckedCreateWithoutCallsImportInput.schema';
import { SiteWhereInputObjectSchema as SiteWhereInputObjectSchema } from './SiteWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => SiteUpdateWithoutCallsImportInputObjectSchema), z.lazy(() => SiteUncheckedUpdateWithoutCallsImportInputObjectSchema)]),
  create: z.union([z.lazy(() => SiteCreateWithoutCallsImportInputObjectSchema), z.lazy(() => SiteUncheckedCreateWithoutCallsImportInputObjectSchema)]),
  where: z.lazy(() => SiteWhereInputObjectSchema).optional()
}).strict();
export const SiteUpsertWithoutCallsImportInputObjectSchema: z.ZodType<Prisma.SiteUpsertWithoutCallsImportInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteUpsertWithoutCallsImportInput>;
export const SiteUpsertWithoutCallsImportInputObjectZodSchema = makeSchema();
