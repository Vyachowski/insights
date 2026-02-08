import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { ExpenseCreateWithoutCityInputObjectSchema as ExpenseCreateWithoutCityInputObjectSchema } from './ExpenseCreateWithoutCityInput.schema';
import { ExpenseUncheckedCreateWithoutCityInputObjectSchema as ExpenseUncheckedCreateWithoutCityInputObjectSchema } from './ExpenseUncheckedCreateWithoutCityInput.schema';
import { ExpenseCreateOrConnectWithoutCityInputObjectSchema as ExpenseCreateOrConnectWithoutCityInputObjectSchema } from './ExpenseCreateOrConnectWithoutCityInput.schema';
import { ExpenseUpsertWithWhereUniqueWithoutCityInputObjectSchema as ExpenseUpsertWithWhereUniqueWithoutCityInputObjectSchema } from './ExpenseUpsertWithWhereUniqueWithoutCityInput.schema';
import { ExpenseCreateManyCityInputEnvelopeObjectSchema as ExpenseCreateManyCityInputEnvelopeObjectSchema } from './ExpenseCreateManyCityInputEnvelope.schema';
import { ExpenseWhereUniqueInputObjectSchema as ExpenseWhereUniqueInputObjectSchema } from './ExpenseWhereUniqueInput.schema';
import { ExpenseUpdateWithWhereUniqueWithoutCityInputObjectSchema as ExpenseUpdateWithWhereUniqueWithoutCityInputObjectSchema } from './ExpenseUpdateWithWhereUniqueWithoutCityInput.schema';
import { ExpenseUpdateManyWithWhereWithoutCityInputObjectSchema as ExpenseUpdateManyWithWhereWithoutCityInputObjectSchema } from './ExpenseUpdateManyWithWhereWithoutCityInput.schema';
import { ExpenseScalarWhereInputObjectSchema as ExpenseScalarWhereInputObjectSchema } from './ExpenseScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ExpenseCreateWithoutCityInputObjectSchema), z.lazy(() => ExpenseCreateWithoutCityInputObjectSchema).array(), z.lazy(() => ExpenseUncheckedCreateWithoutCityInputObjectSchema), z.lazy(() => ExpenseUncheckedCreateWithoutCityInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ExpenseCreateOrConnectWithoutCityInputObjectSchema), z.lazy(() => ExpenseCreateOrConnectWithoutCityInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => ExpenseUpsertWithWhereUniqueWithoutCityInputObjectSchema), z.lazy(() => ExpenseUpsertWithWhereUniqueWithoutCityInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ExpenseCreateManyCityInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => ExpenseWhereUniqueInputObjectSchema), z.lazy(() => ExpenseWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => ExpenseWhereUniqueInputObjectSchema), z.lazy(() => ExpenseWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => ExpenseWhereUniqueInputObjectSchema), z.lazy(() => ExpenseWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => ExpenseWhereUniqueInputObjectSchema), z.lazy(() => ExpenseWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => ExpenseUpdateWithWhereUniqueWithoutCityInputObjectSchema), z.lazy(() => ExpenseUpdateWithWhereUniqueWithoutCityInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => ExpenseUpdateManyWithWhereWithoutCityInputObjectSchema), z.lazy(() => ExpenseUpdateManyWithWhereWithoutCityInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => ExpenseScalarWhereInputObjectSchema), z.lazy(() => ExpenseScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const ExpenseUpdateManyWithoutCityNestedInputObjectSchema: z.ZodType<Prisma.ExpenseUpdateManyWithoutCityNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ExpenseUpdateManyWithoutCityNestedInput>;
export const ExpenseUpdateManyWithoutCityNestedInputObjectZodSchema = makeSchema();
