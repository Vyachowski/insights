import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { ExpenseCreateWithoutCityInputObjectSchema as ExpenseCreateWithoutCityInputObjectSchema } from './ExpenseCreateWithoutCityInput.schema';
import { ExpenseUncheckedCreateWithoutCityInputObjectSchema as ExpenseUncheckedCreateWithoutCityInputObjectSchema } from './ExpenseUncheckedCreateWithoutCityInput.schema';
import { ExpenseCreateOrConnectWithoutCityInputObjectSchema as ExpenseCreateOrConnectWithoutCityInputObjectSchema } from './ExpenseCreateOrConnectWithoutCityInput.schema';
import { ExpenseCreateManyCityInputEnvelopeObjectSchema as ExpenseCreateManyCityInputEnvelopeObjectSchema } from './ExpenseCreateManyCityInputEnvelope.schema';
import { ExpenseWhereUniqueInputObjectSchema as ExpenseWhereUniqueInputObjectSchema } from './ExpenseWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ExpenseCreateWithoutCityInputObjectSchema), z.lazy(() => ExpenseCreateWithoutCityInputObjectSchema).array(), z.lazy(() => ExpenseUncheckedCreateWithoutCityInputObjectSchema), z.lazy(() => ExpenseUncheckedCreateWithoutCityInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ExpenseCreateOrConnectWithoutCityInputObjectSchema), z.lazy(() => ExpenseCreateOrConnectWithoutCityInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ExpenseCreateManyCityInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => ExpenseWhereUniqueInputObjectSchema), z.lazy(() => ExpenseWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const ExpenseUncheckedCreateNestedManyWithoutCityInputObjectSchema: z.ZodType<Prisma.ExpenseUncheckedCreateNestedManyWithoutCityInput> = makeSchema() as unknown as z.ZodType<Prisma.ExpenseUncheckedCreateNestedManyWithoutCityInput>;
export const ExpenseUncheckedCreateNestedManyWithoutCityInputObjectZodSchema = makeSchema();
