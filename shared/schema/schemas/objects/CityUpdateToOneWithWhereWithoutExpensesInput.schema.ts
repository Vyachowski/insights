import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { CityWhereInputObjectSchema as CityWhereInputObjectSchema } from './CityWhereInput.schema';
import { CityUpdateWithoutExpensesInputObjectSchema as CityUpdateWithoutExpensesInputObjectSchema } from './CityUpdateWithoutExpensesInput.schema';
import { CityUncheckedUpdateWithoutExpensesInputObjectSchema as CityUncheckedUpdateWithoutExpensesInputObjectSchema } from './CityUncheckedUpdateWithoutExpensesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CityWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => CityUpdateWithoutExpensesInputObjectSchema), z.lazy(() => CityUncheckedUpdateWithoutExpensesInputObjectSchema)])
}).strict();
export const CityUpdateToOneWithWhereWithoutExpensesInputObjectSchema: z.ZodType<Prisma.CityUpdateToOneWithWhereWithoutExpensesInput> = makeSchema() as unknown as z.ZodType<Prisma.CityUpdateToOneWithWhereWithoutExpensesInput>;
export const CityUpdateToOneWithWhereWithoutExpensesInputObjectZodSchema = makeSchema();
