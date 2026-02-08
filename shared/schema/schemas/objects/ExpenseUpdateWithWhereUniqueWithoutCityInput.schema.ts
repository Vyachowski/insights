import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { ExpenseWhereUniqueInputObjectSchema as ExpenseWhereUniqueInputObjectSchema } from './ExpenseWhereUniqueInput.schema';
import { ExpenseUpdateWithoutCityInputObjectSchema as ExpenseUpdateWithoutCityInputObjectSchema } from './ExpenseUpdateWithoutCityInput.schema';
import { ExpenseUncheckedUpdateWithoutCityInputObjectSchema as ExpenseUncheckedUpdateWithoutCityInputObjectSchema } from './ExpenseUncheckedUpdateWithoutCityInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ExpenseWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => ExpenseUpdateWithoutCityInputObjectSchema), z.lazy(() => ExpenseUncheckedUpdateWithoutCityInputObjectSchema)])
}).strict();
export const ExpenseUpdateWithWhereUniqueWithoutCityInputObjectSchema: z.ZodType<Prisma.ExpenseUpdateWithWhereUniqueWithoutCityInput> = makeSchema() as unknown as z.ZodType<Prisma.ExpenseUpdateWithWhereUniqueWithoutCityInput>;
export const ExpenseUpdateWithWhereUniqueWithoutCityInputObjectZodSchema = makeSchema();
