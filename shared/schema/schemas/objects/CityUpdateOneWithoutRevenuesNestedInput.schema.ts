import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { CityCreateWithoutRevenuesInputObjectSchema as CityCreateWithoutRevenuesInputObjectSchema } from './CityCreateWithoutRevenuesInput.schema';
import { CityUncheckedCreateWithoutRevenuesInputObjectSchema as CityUncheckedCreateWithoutRevenuesInputObjectSchema } from './CityUncheckedCreateWithoutRevenuesInput.schema';
import { CityCreateOrConnectWithoutRevenuesInputObjectSchema as CityCreateOrConnectWithoutRevenuesInputObjectSchema } from './CityCreateOrConnectWithoutRevenuesInput.schema';
import { CityUpsertWithoutRevenuesInputObjectSchema as CityUpsertWithoutRevenuesInputObjectSchema } from './CityUpsertWithoutRevenuesInput.schema';
import { CityWhereInputObjectSchema as CityWhereInputObjectSchema } from './CityWhereInput.schema';
import { CityWhereUniqueInputObjectSchema as CityWhereUniqueInputObjectSchema } from './CityWhereUniqueInput.schema';
import { CityUpdateToOneWithWhereWithoutRevenuesInputObjectSchema as CityUpdateToOneWithWhereWithoutRevenuesInputObjectSchema } from './CityUpdateToOneWithWhereWithoutRevenuesInput.schema';
import { CityUpdateWithoutRevenuesInputObjectSchema as CityUpdateWithoutRevenuesInputObjectSchema } from './CityUpdateWithoutRevenuesInput.schema';
import { CityUncheckedUpdateWithoutRevenuesInputObjectSchema as CityUncheckedUpdateWithoutRevenuesInputObjectSchema } from './CityUncheckedUpdateWithoutRevenuesInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => CityCreateWithoutRevenuesInputObjectSchema), z.lazy(() => CityUncheckedCreateWithoutRevenuesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => CityCreateOrConnectWithoutRevenuesInputObjectSchema).optional(),
  upsert: z.lazy(() => CityUpsertWithoutRevenuesInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => CityWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => CityWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => CityWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => CityUpdateToOneWithWhereWithoutRevenuesInputObjectSchema), z.lazy(() => CityUpdateWithoutRevenuesInputObjectSchema), z.lazy(() => CityUncheckedUpdateWithoutRevenuesInputObjectSchema)]).optional()
}).strict();
export const CityUpdateOneWithoutRevenuesNestedInputObjectSchema: z.ZodType<Prisma.CityUpdateOneWithoutRevenuesNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.CityUpdateOneWithoutRevenuesNestedInput>;
export const CityUpdateOneWithoutRevenuesNestedInputObjectZodSchema = makeSchema();
