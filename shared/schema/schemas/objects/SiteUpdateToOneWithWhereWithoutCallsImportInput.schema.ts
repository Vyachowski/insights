import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteWhereInputObjectSchema as SiteWhereInputObjectSchema } from './SiteWhereInput.schema';
import { SiteUpdateWithoutCallsImportInputObjectSchema as SiteUpdateWithoutCallsImportInputObjectSchema } from './SiteUpdateWithoutCallsImportInput.schema';
import { SiteUncheckedUpdateWithoutCallsImportInputObjectSchema as SiteUncheckedUpdateWithoutCallsImportInputObjectSchema } from './SiteUncheckedUpdateWithoutCallsImportInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => SiteWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => SiteUpdateWithoutCallsImportInputObjectSchema), z.lazy(() => SiteUncheckedUpdateWithoutCallsImportInputObjectSchema)])
}).strict();
export const SiteUpdateToOneWithWhereWithoutCallsImportInputObjectSchema: z.ZodType<Prisma.SiteUpdateToOneWithWhereWithoutCallsImportInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteUpdateToOneWithWhereWithoutCallsImportInput>;
export const SiteUpdateToOneWithWhereWithoutCallsImportInputObjectZodSchema = makeSchema();
