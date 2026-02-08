import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { CityWhereInputObjectSchema as CityWhereInputObjectSchema } from './CityWhereInput.schema';
import { CityUpdateWithoutRevenuesInputObjectSchema as CityUpdateWithoutRevenuesInputObjectSchema } from './CityUpdateWithoutRevenuesInput.schema';
import { CityUncheckedUpdateWithoutRevenuesInputObjectSchema as CityUncheckedUpdateWithoutRevenuesInputObjectSchema } from './CityUncheckedUpdateWithoutRevenuesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CityWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => CityUpdateWithoutRevenuesInputObjectSchema), z.lazy(() => CityUncheckedUpdateWithoutRevenuesInputObjectSchema)])
}).strict();
export const CityUpdateToOneWithWhereWithoutRevenuesInputObjectSchema: z.ZodType<Prisma.CityUpdateToOneWithWhereWithoutRevenuesInput> = makeSchema() as unknown as z.ZodType<Prisma.CityUpdateToOneWithWhereWithoutRevenuesInput>;
export const CityUpdateToOneWithWhereWithoutRevenuesInputObjectZodSchema = makeSchema();
