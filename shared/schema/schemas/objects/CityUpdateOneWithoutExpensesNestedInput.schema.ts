import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { CityCreateWithoutExpensesInputObjectSchema as CityCreateWithoutExpensesInputObjectSchema } from './CityCreateWithoutExpensesInput.schema';
import { CityUncheckedCreateWithoutExpensesInputObjectSchema as CityUncheckedCreateWithoutExpensesInputObjectSchema } from './CityUncheckedCreateWithoutExpensesInput.schema';
import { CityCreateOrConnectWithoutExpensesInputObjectSchema as CityCreateOrConnectWithoutExpensesInputObjectSchema } from './CityCreateOrConnectWithoutExpensesInput.schema';
import { CityUpsertWithoutExpensesInputObjectSchema as CityUpsertWithoutExpensesInputObjectSchema } from './CityUpsertWithoutExpensesInput.schema';
import { CityWhereInputObjectSchema as CityWhereInputObjectSchema } from './CityWhereInput.schema';
import { CityWhereUniqueInputObjectSchema as CityWhereUniqueInputObjectSchema } from './CityWhereUniqueInput.schema';
import { CityUpdateToOneWithWhereWithoutExpensesInputObjectSchema as CityUpdateToOneWithWhereWithoutExpensesInputObjectSchema } from './CityUpdateToOneWithWhereWithoutExpensesInput.schema';
import { CityUpdateWithoutExpensesInputObjectSchema as CityUpdateWithoutExpensesInputObjectSchema } from './CityUpdateWithoutExpensesInput.schema';
import { CityUncheckedUpdateWithoutExpensesInputObjectSchema as CityUncheckedUpdateWithoutExpensesInputObjectSchema } from './CityUncheckedUpdateWithoutExpensesInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => CityCreateWithoutExpensesInputObjectSchema), z.lazy(() => CityUncheckedCreateWithoutExpensesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => CityCreateOrConnectWithoutExpensesInputObjectSchema).optional(),
  upsert: z.lazy(() => CityUpsertWithoutExpensesInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => CityWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => CityWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => CityWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => CityUpdateToOneWithWhereWithoutExpensesInputObjectSchema), z.lazy(() => CityUpdateWithoutExpensesInputObjectSchema), z.lazy(() => CityUncheckedUpdateWithoutExpensesInputObjectSchema)]).optional()
}).strict();
export const CityUpdateOneWithoutExpensesNestedInputObjectSchema: z.ZodType<Prisma.CityUpdateOneWithoutExpensesNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.CityUpdateOneWithoutExpensesNestedInput>;
export const CityUpdateOneWithoutExpensesNestedInputObjectZodSchema = makeSchema();
