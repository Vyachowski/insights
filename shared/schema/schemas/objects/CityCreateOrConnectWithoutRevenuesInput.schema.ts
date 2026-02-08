import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { CityWhereUniqueInputObjectSchema as CityWhereUniqueInputObjectSchema } from './CityWhereUniqueInput.schema';
import { CityCreateWithoutRevenuesInputObjectSchema as CityCreateWithoutRevenuesInputObjectSchema } from './CityCreateWithoutRevenuesInput.schema';
import { CityUncheckedCreateWithoutRevenuesInputObjectSchema as CityUncheckedCreateWithoutRevenuesInputObjectSchema } from './CityUncheckedCreateWithoutRevenuesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CityWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => CityCreateWithoutRevenuesInputObjectSchema), z.lazy(() => CityUncheckedCreateWithoutRevenuesInputObjectSchema)])
}).strict();
export const CityCreateOrConnectWithoutRevenuesInputObjectSchema: z.ZodType<Prisma.CityCreateOrConnectWithoutRevenuesInput> = makeSchema() as unknown as z.ZodType<Prisma.CityCreateOrConnectWithoutRevenuesInput>;
export const CityCreateOrConnectWithoutRevenuesInputObjectZodSchema = makeSchema();
