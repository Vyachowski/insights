import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { CityUpdateWithoutRevenuesInputObjectSchema as CityUpdateWithoutRevenuesInputObjectSchema } from './CityUpdateWithoutRevenuesInput.schema';
import { CityUncheckedUpdateWithoutRevenuesInputObjectSchema as CityUncheckedUpdateWithoutRevenuesInputObjectSchema } from './CityUncheckedUpdateWithoutRevenuesInput.schema';
import { CityCreateWithoutRevenuesInputObjectSchema as CityCreateWithoutRevenuesInputObjectSchema } from './CityCreateWithoutRevenuesInput.schema';
import { CityUncheckedCreateWithoutRevenuesInputObjectSchema as CityUncheckedCreateWithoutRevenuesInputObjectSchema } from './CityUncheckedCreateWithoutRevenuesInput.schema';
import { CityWhereInputObjectSchema as CityWhereInputObjectSchema } from './CityWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => CityUpdateWithoutRevenuesInputObjectSchema), z.lazy(() => CityUncheckedUpdateWithoutRevenuesInputObjectSchema)]),
  create: z.union([z.lazy(() => CityCreateWithoutRevenuesInputObjectSchema), z.lazy(() => CityUncheckedCreateWithoutRevenuesInputObjectSchema)]),
  where: z.lazy(() => CityWhereInputObjectSchema).optional()
}).strict();
export const CityUpsertWithoutRevenuesInputObjectSchema: z.ZodType<Prisma.CityUpsertWithoutRevenuesInput> = makeSchema() as unknown as z.ZodType<Prisma.CityUpsertWithoutRevenuesInput>;
export const CityUpsertWithoutRevenuesInputObjectZodSchema = makeSchema();
