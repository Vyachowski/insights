import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { CallImportCreateWithoutSiteInputObjectSchema as CallImportCreateWithoutSiteInputObjectSchema } from './CallImportCreateWithoutSiteInput.schema';
import { CallImportUncheckedCreateWithoutSiteInputObjectSchema as CallImportUncheckedCreateWithoutSiteInputObjectSchema } from './CallImportUncheckedCreateWithoutSiteInput.schema';
import { CallImportCreateOrConnectWithoutSiteInputObjectSchema as CallImportCreateOrConnectWithoutSiteInputObjectSchema } from './CallImportCreateOrConnectWithoutSiteInput.schema';
import { CallImportCreateManySiteInputEnvelopeObjectSchema as CallImportCreateManySiteInputEnvelopeObjectSchema } from './CallImportCreateManySiteInputEnvelope.schema';
import { CallImportWhereUniqueInputObjectSchema as CallImportWhereUniqueInputObjectSchema } from './CallImportWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => CallImportCreateWithoutSiteInputObjectSchema), z.lazy(() => CallImportCreateWithoutSiteInputObjectSchema).array(), z.lazy(() => CallImportUncheckedCreateWithoutSiteInputObjectSchema), z.lazy(() => CallImportUncheckedCreateWithoutSiteInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => CallImportCreateOrConnectWithoutSiteInputObjectSchema), z.lazy(() => CallImportCreateOrConnectWithoutSiteInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => CallImportCreateManySiteInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => CallImportWhereUniqueInputObjectSchema), z.lazy(() => CallImportWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const CallImportUncheckedCreateNestedManyWithoutSiteInputObjectSchema: z.ZodType<Prisma.CallImportUncheckedCreateNestedManyWithoutSiteInput> = makeSchema() as unknown as z.ZodType<Prisma.CallImportUncheckedCreateNestedManyWithoutSiteInput>;
export const CallImportUncheckedCreateNestedManyWithoutSiteInputObjectZodSchema = makeSchema();
