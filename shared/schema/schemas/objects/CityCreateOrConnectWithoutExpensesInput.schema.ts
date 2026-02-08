import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { CityWhereUniqueInputObjectSchema as CityWhereUniqueInputObjectSchema } from './CityWhereUniqueInput.schema';
import { CityCreateWithoutExpensesInputObjectSchema as CityCreateWithoutExpensesInputObjectSchema } from './CityCreateWithoutExpensesInput.schema';
import { CityUncheckedCreateWithoutExpensesInputObjectSchema as CityUncheckedCreateWithoutExpensesInputObjectSchema } from './CityUncheckedCreateWithoutExpensesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CityWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => CityCreateWithoutExpensesInputObjectSchema), z.lazy(() => CityUncheckedCreateWithoutExpensesInputObjectSchema)])
}).strict();
export const CityCreateOrConnectWithoutExpensesInputObjectSchema: z.ZodType<Prisma.CityCreateOrConnectWithoutExpensesInput> = makeSchema() as unknown as z.ZodType<Prisma.CityCreateOrConnectWithoutExpensesInput>;
export const CityCreateOrConnectWithoutExpensesInputObjectZodSchema = makeSchema();
