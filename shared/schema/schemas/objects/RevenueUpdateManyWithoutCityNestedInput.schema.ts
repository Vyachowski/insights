import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { RevenueCreateWithoutCityInputObjectSchema as RevenueCreateWithoutCityInputObjectSchema } from './RevenueCreateWithoutCityInput.schema';
import { RevenueUncheckedCreateWithoutCityInputObjectSchema as RevenueUncheckedCreateWithoutCityInputObjectSchema } from './RevenueUncheckedCreateWithoutCityInput.schema';
import { RevenueCreateOrConnectWithoutCityInputObjectSchema as RevenueCreateOrConnectWithoutCityInputObjectSchema } from './RevenueCreateOrConnectWithoutCityInput.schema';
import { RevenueUpsertWithWhereUniqueWithoutCityInputObjectSchema as RevenueUpsertWithWhereUniqueWithoutCityInputObjectSchema } from './RevenueUpsertWithWhereUniqueWithoutCityInput.schema';
import { RevenueCreateManyCityInputEnvelopeObjectSchema as RevenueCreateManyCityInputEnvelopeObjectSchema } from './RevenueCreateManyCityInputEnvelope.schema';
import { RevenueWhereUniqueInputObjectSchema as RevenueWhereUniqueInputObjectSchema } from './RevenueWhereUniqueInput.schema';
import { RevenueUpdateWithWhereUniqueWithoutCityInputObjectSchema as RevenueUpdateWithWhereUniqueWithoutCityInputObjectSchema } from './RevenueUpdateWithWhereUniqueWithoutCityInput.schema';
import { RevenueUpdateManyWithWhereWithoutCityInputObjectSchema as RevenueUpdateManyWithWhereWithoutCityInputObjectSchema } from './RevenueUpdateManyWithWhereWithoutCityInput.schema';
import { RevenueScalarWhereInputObjectSchema as RevenueScalarWhereInputObjectSchema } from './RevenueScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => RevenueCreateWithoutCityInputObjectSchema), z.lazy(() => RevenueCreateWithoutCityInputObjectSchema).array(), z.lazy(() => RevenueUncheckedCreateWithoutCityInputObjectSchema), z.lazy(() => RevenueUncheckedCreateWithoutCityInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => RevenueCreateOrConnectWithoutCityInputObjectSchema), z.lazy(() => RevenueCreateOrConnectWithoutCityInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => RevenueUpsertWithWhereUniqueWithoutCityInputObjectSchema), z.lazy(() => RevenueUpsertWithWhereUniqueWithoutCityInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => RevenueCreateManyCityInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => RevenueWhereUniqueInputObjectSchema), z.lazy(() => RevenueWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => RevenueWhereUniqueInputObjectSchema), z.lazy(() => RevenueWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => RevenueWhereUniqueInputObjectSchema), z.lazy(() => RevenueWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => RevenueWhereUniqueInputObjectSchema), z.lazy(() => RevenueWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => RevenueUpdateWithWhereUniqueWithoutCityInputObjectSchema), z.lazy(() => RevenueUpdateWithWhereUniqueWithoutCityInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => RevenueUpdateManyWithWhereWithoutCityInputObjectSchema), z.lazy(() => RevenueUpdateManyWithWhereWithoutCityInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => RevenueScalarWhereInputObjectSchema), z.lazy(() => RevenueScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const RevenueUpdateManyWithoutCityNestedInputObjectSchema: z.ZodType<Prisma.RevenueUpdateManyWithoutCityNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.RevenueUpdateManyWithoutCityNestedInput>;
export const RevenueUpdateManyWithoutCityNestedInputObjectZodSchema = makeSchema();
