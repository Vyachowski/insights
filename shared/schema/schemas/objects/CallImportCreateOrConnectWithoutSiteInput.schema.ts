import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { CallImportWhereUniqueInputObjectSchema as CallImportWhereUniqueInputObjectSchema } from './CallImportWhereUniqueInput.schema';
import { CallImportCreateWithoutSiteInputObjectSchema as CallImportCreateWithoutSiteInputObjectSchema } from './CallImportCreateWithoutSiteInput.schema';
import { CallImportUncheckedCreateWithoutSiteInputObjectSchema as CallImportUncheckedCreateWithoutSiteInputObjectSchema } from './CallImportUncheckedCreateWithoutSiteInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CallImportWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => CallImportCreateWithoutSiteInputObjectSchema), z.lazy(() => CallImportUncheckedCreateWithoutSiteInputObjectSchema)])
}).strict();
export const CallImportCreateOrConnectWithoutSiteInputObjectSchema: z.ZodType<Prisma.CallImportCreateOrConnectWithoutSiteInput> = makeSchema() as unknown as z.ZodType<Prisma.CallImportCreateOrConnectWithoutSiteInput>;
export const CallImportCreateOrConnectWithoutSiteInputObjectZodSchema = makeSchema();
