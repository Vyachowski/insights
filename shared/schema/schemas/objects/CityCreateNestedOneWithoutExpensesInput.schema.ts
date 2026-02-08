import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { CityCreateWithoutExpensesInputObjectSchema as CityCreateWithoutExpensesInputObjectSchema } from './CityCreateWithoutExpensesInput.schema';
import { CityUncheckedCreateWithoutExpensesInputObjectSchema as CityUncheckedCreateWithoutExpensesInputObjectSchema } from './CityUncheckedCreateWithoutExpensesInput.schema';
import { CityCreateOrConnectWithoutExpensesInputObjectSchema as CityCreateOrConnectWithoutExpensesInputObjectSchema } from './CityCreateOrConnectWithoutExpensesInput.schema';
import { CityWhereUniqueInputObjectSchema as CityWhereUniqueInputObjectSchema } from './CityWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => CityCreateWithoutExpensesInputObjectSchema), z.lazy(() => CityUncheckedCreateWithoutExpensesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => CityCreateOrConnectWithoutExpensesInputObjectSchema).optional(),
  connect: z.lazy(() => CityWhereUniqueInputObjectSchema).optional()
}).strict();
export const CityCreateNestedOneWithoutExpensesInputObjectSchema: z.ZodType<Prisma.CityCreateNestedOneWithoutExpensesInput> = makeSchema() as unknown as z.ZodType<Prisma.CityCreateNestedOneWithoutExpensesInput>;
export const CityCreateNestedOneWithoutExpensesInputObjectZodSchema = makeSchema();
