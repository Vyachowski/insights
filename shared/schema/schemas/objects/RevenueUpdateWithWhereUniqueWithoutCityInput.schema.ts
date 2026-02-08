import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { RevenueWhereUniqueInputObjectSchema as RevenueWhereUniqueInputObjectSchema } from './RevenueWhereUniqueInput.schema';
import { RevenueUpdateWithoutCityInputObjectSchema as RevenueUpdateWithoutCityInputObjectSchema } from './RevenueUpdateWithoutCityInput.schema';
import { RevenueUncheckedUpdateWithoutCityInputObjectSchema as RevenueUncheckedUpdateWithoutCityInputObjectSchema } from './RevenueUncheckedUpdateWithoutCityInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => RevenueWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => RevenueUpdateWithoutCityInputObjectSchema), z.lazy(() => RevenueUncheckedUpdateWithoutCityInputObjectSchema)])
}).strict();
export const RevenueUpdateWithWhereUniqueWithoutCityInputObjectSchema: z.ZodType<Prisma.RevenueUpdateWithWhereUniqueWithoutCityInput> = makeSchema() as unknown as z.ZodType<Prisma.RevenueUpdateWithWhereUniqueWithoutCityInput>;
export const RevenueUpdateWithWhereUniqueWithoutCityInputObjectZodSchema = makeSchema();
