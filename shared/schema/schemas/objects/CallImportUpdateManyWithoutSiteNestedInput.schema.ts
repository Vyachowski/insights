import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { CallImportCreateWithoutSiteInputObjectSchema as CallImportCreateWithoutSiteInputObjectSchema } from './CallImportCreateWithoutSiteInput.schema';
import { CallImportUncheckedCreateWithoutSiteInputObjectSchema as CallImportUncheckedCreateWithoutSiteInputObjectSchema } from './CallImportUncheckedCreateWithoutSiteInput.schema';
import { CallImportCreateOrConnectWithoutSiteInputObjectSchema as CallImportCreateOrConnectWithoutSiteInputObjectSchema } from './CallImportCreateOrConnectWithoutSiteInput.schema';
import { CallImportUpsertWithWhereUniqueWithoutSiteInputObjectSchema as CallImportUpsertWithWhereUniqueWithoutSiteInputObjectSchema } from './CallImportUpsertWithWhereUniqueWithoutSiteInput.schema';
import { CallImportCreateManySiteInputEnvelopeObjectSchema as CallImportCreateManySiteInputEnvelopeObjectSchema } from './CallImportCreateManySiteInputEnvelope.schema';
import { CallImportWhereUniqueInputObjectSchema as CallImportWhereUniqueInputObjectSchema } from './CallImportWhereUniqueInput.schema';
import { CallImportUpdateWithWhereUniqueWithoutSiteInputObjectSchema as CallImportUpdateWithWhereUniqueWithoutSiteInputObjectSchema } from './CallImportUpdateWithWhereUniqueWithoutSiteInput.schema';
import { CallImportUpdateManyWithWhereWithoutSiteInputObjectSchema as CallImportUpdateManyWithWhereWithoutSiteInputObjectSchema } from './CallImportUpdateManyWithWhereWithoutSiteInput.schema';
import { CallImportScalarWhereInputObjectSchema as CallImportScalarWhereInputObjectSchema } from './CallImportScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => CallImportCreateWithoutSiteInputObjectSchema), z.lazy(() => CallImportCreateWithoutSiteInputObjectSchema).array(), z.lazy(() => CallImportUncheckedCreateWithoutSiteInputObjectSchema), z.lazy(() => CallImportUncheckedCreateWithoutSiteInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => CallImportCreateOrConnectWithoutSiteInputObjectSchema), z.lazy(() => CallImportCreateOrConnectWithoutSiteInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => CallImportUpsertWithWhereUniqueWithoutSiteInputObjectSchema), z.lazy(() => CallImportUpsertWithWhereUniqueWithoutSiteInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => CallImportCreateManySiteInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => CallImportWhereUniqueInputObjectSchema), z.lazy(() => CallImportWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => CallImportWhereUniqueInputObjectSchema), z.lazy(() => CallImportWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => CallImportWhereUniqueInputObjectSchema), z.lazy(() => CallImportWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => CallImportWhereUniqueInputObjectSchema), z.lazy(() => CallImportWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => CallImportUpdateWithWhereUniqueWithoutSiteInputObjectSchema), z.lazy(() => CallImportUpdateWithWhereUniqueWithoutSiteInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => CallImportUpdateManyWithWhereWithoutSiteInputObjectSchema), z.lazy(() => CallImportUpdateManyWithWhereWithoutSiteInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => CallImportScalarWhereInputObjectSchema), z.lazy(() => CallImportScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const CallImportUpdateManyWithoutSiteNestedInputObjectSchema: z.ZodType<Prisma.CallImportUpdateManyWithoutSiteNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.CallImportUpdateManyWithoutSiteNestedInput>;
export const CallImportUpdateManyWithoutSiteNestedInputObjectZodSchema = makeSchema();
