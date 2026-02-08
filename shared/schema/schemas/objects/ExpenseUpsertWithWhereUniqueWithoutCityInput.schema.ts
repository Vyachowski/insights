import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { ExpenseWhereUniqueInputObjectSchema as ExpenseWhereUniqueInputObjectSchema } from './ExpenseWhereUniqueInput.schema';
import { ExpenseUpdateWithoutCityInputObjectSchema as ExpenseUpdateWithoutCityInputObjectSchema } from './ExpenseUpdateWithoutCityInput.schema';
import { ExpenseUncheckedUpdateWithoutCityInputObjectSchema as ExpenseUncheckedUpdateWithoutCityInputObjectSchema } from './ExpenseUncheckedUpdateWithoutCityInput.schema';
import { ExpenseCreateWithoutCityInputObjectSchema as ExpenseCreateWithoutCityInputObjectSchema } from './ExpenseCreateWithoutCityInput.schema';
import { ExpenseUncheckedCreateWithoutCityInputObjectSchema as ExpenseUncheckedCreateWithoutCityInputObjectSchema } from './ExpenseUncheckedCreateWithoutCityInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ExpenseWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => ExpenseUpdateWithoutCityInputObjectSchema), z.lazy(() => ExpenseUncheckedUpdateWithoutCityInputObjectSchema)]),
  create: z.union([z.lazy(() => ExpenseCreateWithoutCityInputObjectSchema), z.lazy(() => ExpenseUncheckedCreateWithoutCityInputObjectSchema)])
}).strict();
export const ExpenseUpsertWithWhereUniqueWithoutCityInputObjectSchema: z.ZodType<Prisma.ExpenseUpsertWithWhereUniqueWithoutCityInput> = makeSchema() as unknown as z.ZodType<Prisma.ExpenseUpsertWithWhereUniqueWithoutCityInput>;
export const ExpenseUpsertWithWhereUniqueWithoutCityInputObjectZodSchema = makeSchema();
