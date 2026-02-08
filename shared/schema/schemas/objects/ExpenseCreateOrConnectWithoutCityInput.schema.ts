import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { ExpenseWhereUniqueInputObjectSchema as ExpenseWhereUniqueInputObjectSchema } from './ExpenseWhereUniqueInput.schema';
import { ExpenseCreateWithoutCityInputObjectSchema as ExpenseCreateWithoutCityInputObjectSchema } from './ExpenseCreateWithoutCityInput.schema';
import { ExpenseUncheckedCreateWithoutCityInputObjectSchema as ExpenseUncheckedCreateWithoutCityInputObjectSchema } from './ExpenseUncheckedCreateWithoutCityInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ExpenseWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ExpenseCreateWithoutCityInputObjectSchema), z.lazy(() => ExpenseUncheckedCreateWithoutCityInputObjectSchema)])
}).strict();
export const ExpenseCreateOrConnectWithoutCityInputObjectSchema: z.ZodType<Prisma.ExpenseCreateOrConnectWithoutCityInput> = makeSchema() as unknown as z.ZodType<Prisma.ExpenseCreateOrConnectWithoutCityInput>;
export const ExpenseCreateOrConnectWithoutCityInputObjectZodSchema = makeSchema();
