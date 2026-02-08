import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { CallImportWhereUniqueInputObjectSchema as CallImportWhereUniqueInputObjectSchema } from './CallImportWhereUniqueInput.schema';
import { CallImportUpdateWithoutSiteInputObjectSchema as CallImportUpdateWithoutSiteInputObjectSchema } from './CallImportUpdateWithoutSiteInput.schema';
import { CallImportUncheckedUpdateWithoutSiteInputObjectSchema as CallImportUncheckedUpdateWithoutSiteInputObjectSchema } from './CallImportUncheckedUpdateWithoutSiteInput.schema';
import { CallImportCreateWithoutSiteInputObjectSchema as CallImportCreateWithoutSiteInputObjectSchema } from './CallImportCreateWithoutSiteInput.schema';
import { CallImportUncheckedCreateWithoutSiteInputObjectSchema as CallImportUncheckedCreateWithoutSiteInputObjectSchema } from './CallImportUncheckedCreateWithoutSiteInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CallImportWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => CallImportUpdateWithoutSiteInputObjectSchema), z.lazy(() => CallImportUncheckedUpdateWithoutSiteInputObjectSchema)]),
  create: z.union([z.lazy(() => CallImportCreateWithoutSiteInputObjectSchema), z.lazy(() => CallImportUncheckedCreateWithoutSiteInputObjectSchema)])
}).strict();
export const CallImportUpsertWithWhereUniqueWithoutSiteInputObjectSchema: z.ZodType<Prisma.CallImportUpsertWithWhereUniqueWithoutSiteInput> = makeSchema() as unknown as z.ZodType<Prisma.CallImportUpsertWithWhereUniqueWithoutSiteInput>;
export const CallImportUpsertWithWhereUniqueWithoutSiteInputObjectZodSchema = makeSchema();
