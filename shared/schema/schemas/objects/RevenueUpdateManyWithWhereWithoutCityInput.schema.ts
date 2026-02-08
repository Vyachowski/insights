import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { RevenueScalarWhereInputObjectSchema as RevenueScalarWhereInputObjectSchema } from './RevenueScalarWhereInput.schema';
import { RevenueUpdateManyMutationInputObjectSchema as RevenueUpdateManyMutationInputObjectSchema } from './RevenueUpdateManyMutationInput.schema';
import { RevenueUncheckedUpdateManyWithoutCityInputObjectSchema as RevenueUncheckedUpdateManyWithoutCityInputObjectSchema } from './RevenueUncheckedUpdateManyWithoutCityInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => RevenueScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => RevenueUpdateManyMutationInputObjectSchema), z.lazy(() => RevenueUncheckedUpdateManyWithoutCityInputObjectSchema)])
}).strict();
export const RevenueUpdateManyWithWhereWithoutCityInputObjectSchema: z.ZodType<Prisma.RevenueUpdateManyWithWhereWithoutCityInput> = makeSchema() as unknown as z.ZodType<Prisma.RevenueUpdateManyWithWhereWithoutCityInput>;
export const RevenueUpdateManyWithWhereWithoutCityInputObjectZodSchema = makeSchema();
