import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { CallCreateWithoutSiteInputObjectSchema as CallCreateWithoutSiteInputObjectSchema } from './CallCreateWithoutSiteInput.schema';
import { CallUncheckedCreateWithoutSiteInputObjectSchema as CallUncheckedCreateWithoutSiteInputObjectSchema } from './CallUncheckedCreateWithoutSiteInput.schema';
import { CallCreateOrConnectWithoutSiteInputObjectSchema as CallCreateOrConnectWithoutSiteInputObjectSchema } from './CallCreateOrConnectWithoutSiteInput.schema';
import { CallUpsertWithWhereUniqueWithoutSiteInputObjectSchema as CallUpsertWithWhereUniqueWithoutSiteInputObjectSchema } from './CallUpsertWithWhereUniqueWithoutSiteInput.schema';
import { CallCreateManySiteInputEnvelopeObjectSchema as CallCreateManySiteInputEnvelopeObjectSchema } from './CallCreateManySiteInputEnvelope.schema';
import { CallWhereUniqueInputObjectSchema as CallWhereUniqueInputObjectSchema } from './CallWhereUniqueInput.schema';
import { CallUpdateWithWhereUniqueWithoutSiteInputObjectSchema as CallUpdateWithWhereUniqueWithoutSiteInputObjectSchema } from './CallUpdateWithWhereUniqueWithoutSiteInput.schema';
import { CallUpdateManyWithWhereWithoutSiteInputObjectSchema as CallUpdateManyWithWhereWithoutSiteInputObjectSchema } from './CallUpdateManyWithWhereWithoutSiteInput.schema';
import { CallScalarWhereInputObjectSchema as CallScalarWhereInputObjectSchema } from './CallScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => CallCreateWithoutSiteInputObjectSchema), z.lazy(() => CallCreateWithoutSiteInputObjectSchema).array(), z.lazy(() => CallUncheckedCreateWithoutSiteInputObjectSchema), z.lazy(() => CallUncheckedCreateWithoutSiteInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => CallCreateOrConnectWithoutSiteInputObjectSchema), z.lazy(() => CallCreateOrConnectWithoutSiteInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => CallUpsertWithWhereUniqueWithoutSiteInputObjectSchema), z.lazy(() => CallUpsertWithWhereUniqueWithoutSiteInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => CallCreateManySiteInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => CallWhereUniqueInputObjectSchema), z.lazy(() => CallWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => CallWhereUniqueInputObjectSchema), z.lazy(() => CallWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => CallWhereUniqueInputObjectSchema), z.lazy(() => CallWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => CallWhereUniqueInputObjectSchema), z.lazy(() => CallWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => CallUpdateWithWhereUniqueWithoutSiteInputObjectSchema), z.lazy(() => CallUpdateWithWhereUniqueWithoutSiteInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => CallUpdateManyWithWhereWithoutSiteInputObjectSchema), z.lazy(() => CallUpdateManyWithWhereWithoutSiteInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => CallScalarWhereInputObjectSchema), z.lazy(() => CallScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const CallUpdateManyWithoutSiteNestedInputObjectSchema: z.ZodType<Prisma.CallUpdateManyWithoutSiteNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.CallUpdateManyWithoutSiteNestedInput>;
export const CallUpdateManyWithoutSiteNestedInputObjectZodSchema = makeSchema();
