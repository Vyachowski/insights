import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { CityUpdateWithoutExpensesInputObjectSchema as CityUpdateWithoutExpensesInputObjectSchema } from './CityUpdateWithoutExpensesInput.schema';
import { CityUncheckedUpdateWithoutExpensesInputObjectSchema as CityUncheckedUpdateWithoutExpensesInputObjectSchema } from './CityUncheckedUpdateWithoutExpensesInput.schema';
import { CityCreateWithoutExpensesInputObjectSchema as CityCreateWithoutExpensesInputObjectSchema } from './CityCreateWithoutExpensesInput.schema';
import { CityUncheckedCreateWithoutExpensesInputObjectSchema as CityUncheckedCreateWithoutExpensesInputObjectSchema } from './CityUncheckedCreateWithoutExpensesInput.schema';
import { CityWhereInputObjectSchema as CityWhereInputObjectSchema } from './CityWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => CityUpdateWithoutExpensesInputObjectSchema), z.lazy(() => CityUncheckedUpdateWithoutExpensesInputObjectSchema)]),
  create: z.union([z.lazy(() => CityCreateWithoutExpensesInputObjectSchema), z.lazy(() => CityUncheckedCreateWithoutExpensesInputObjectSchema)]),
  where: z.lazy(() => CityWhereInputObjectSchema).optional()
}).strict();
export const CityUpsertWithoutExpensesInputObjectSchema: z.ZodType<Prisma.CityUpsertWithoutExpensesInput> = makeSchema() as unknown as z.ZodType<Prisma.CityUpsertWithoutExpensesInput>;
export const CityUpsertWithoutExpensesInputObjectZodSchema = makeSchema();
