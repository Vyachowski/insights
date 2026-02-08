import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { ExpenseScalarWhereInputObjectSchema as ExpenseScalarWhereInputObjectSchema } from './ExpenseScalarWhereInput.schema';
import { ExpenseUpdateManyMutationInputObjectSchema as ExpenseUpdateManyMutationInputObjectSchema } from './ExpenseUpdateManyMutationInput.schema';
import { ExpenseUncheckedUpdateManyWithoutCityInputObjectSchema as ExpenseUncheckedUpdateManyWithoutCityInputObjectSchema } from './ExpenseUncheckedUpdateManyWithoutCityInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ExpenseScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => ExpenseUpdateManyMutationInputObjectSchema), z.lazy(() => ExpenseUncheckedUpdateManyWithoutCityInputObjectSchema)])
}).strict();
export const ExpenseUpdateManyWithWhereWithoutCityInputObjectSchema: z.ZodType<Prisma.ExpenseUpdateManyWithWhereWithoutCityInput> = makeSchema() as unknown as z.ZodType<Prisma.ExpenseUpdateManyWithWhereWithoutCityInput>;
export const ExpenseUpdateManyWithWhereWithoutCityInputObjectZodSchema = makeSchema();
