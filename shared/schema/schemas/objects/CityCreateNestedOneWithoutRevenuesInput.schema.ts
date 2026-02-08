import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { CityCreateWithoutRevenuesInputObjectSchema as CityCreateWithoutRevenuesInputObjectSchema } from './CityCreateWithoutRevenuesInput.schema';
import { CityUncheckedCreateWithoutRevenuesInputObjectSchema as CityUncheckedCreateWithoutRevenuesInputObjectSchema } from './CityUncheckedCreateWithoutRevenuesInput.schema';
import { CityCreateOrConnectWithoutRevenuesInputObjectSchema as CityCreateOrConnectWithoutRevenuesInputObjectSchema } from './CityCreateOrConnectWithoutRevenuesInput.schema';
import { CityWhereUniqueInputObjectSchema as CityWhereUniqueInputObjectSchema } from './CityWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => CityCreateWithoutRevenuesInputObjectSchema), z.lazy(() => CityUncheckedCreateWithoutRevenuesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => CityCreateOrConnectWithoutRevenuesInputObjectSchema).optional(),
  connect: z.lazy(() => CityWhereUniqueInputObjectSchema).optional()
}).strict();
export const CityCreateNestedOneWithoutRevenuesInputObjectSchema: z.ZodType<Prisma.CityCreateNestedOneWithoutRevenuesInput> = makeSchema() as unknown as z.ZodType<Prisma.CityCreateNestedOneWithoutRevenuesInput>;
export const CityCreateNestedOneWithoutRevenuesInputObjectZodSchema = makeSchema();
