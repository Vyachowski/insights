import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { CallImportWhereUniqueInputObjectSchema as CallImportWhereUniqueInputObjectSchema } from './CallImportWhereUniqueInput.schema';
import { CallImportUpdateWithoutSiteInputObjectSchema as CallImportUpdateWithoutSiteInputObjectSchema } from './CallImportUpdateWithoutSiteInput.schema';
import { CallImportUncheckedUpdateWithoutSiteInputObjectSchema as CallImportUncheckedUpdateWithoutSiteInputObjectSchema } from './CallImportUncheckedUpdateWithoutSiteInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CallImportWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => CallImportUpdateWithoutSiteInputObjectSchema), z.lazy(() => CallImportUncheckedUpdateWithoutSiteInputObjectSchema)])
}).strict();
export const CallImportUpdateWithWhereUniqueWithoutSiteInputObjectSchema: z.ZodType<Prisma.CallImportUpdateWithWhereUniqueWithoutSiteInput> = makeSchema() as unknown as z.ZodType<Prisma.CallImportUpdateWithWhereUniqueWithoutSiteInput>;
export const CallImportUpdateWithWhereUniqueWithoutSiteInputObjectZodSchema = makeSchema();
