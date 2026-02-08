import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { RevenueWhereUniqueInputObjectSchema as RevenueWhereUniqueInputObjectSchema } from './RevenueWhereUniqueInput.schema';
import { RevenueUpdateWithoutCityInputObjectSchema as RevenueUpdateWithoutCityInputObjectSchema } from './RevenueUpdateWithoutCityInput.schema';
import { RevenueUncheckedUpdateWithoutCityInputObjectSchema as RevenueUncheckedUpdateWithoutCityInputObjectSchema } from './RevenueUncheckedUpdateWithoutCityInput.schema';
import { RevenueCreateWithoutCityInputObjectSchema as RevenueCreateWithoutCityInputObjectSchema } from './RevenueCreateWithoutCityInput.schema';
import { RevenueUncheckedCreateWithoutCityInputObjectSchema as RevenueUncheckedCreateWithoutCityInputObjectSchema } from './RevenueUncheckedCreateWithoutCityInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => RevenueWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => RevenueUpdateWithoutCityInputObjectSchema), z.lazy(() => RevenueUncheckedUpdateWithoutCityInputObjectSchema)]),
  create: z.union([z.lazy(() => RevenueCreateWithoutCityInputObjectSchema), z.lazy(() => RevenueUncheckedCreateWithoutCityInputObjectSchema)])
}).strict();
export const RevenueUpsertWithWhereUniqueWithoutCityInputObjectSchema: z.ZodType<Prisma.RevenueUpsertWithWhereUniqueWithoutCityInput> = makeSchema() as unknown as z.ZodType<Prisma.RevenueUpsertWithWhereUniqueWithoutCityInput>;
export const RevenueUpsertWithWhereUniqueWithoutCityInputObjectZodSchema = makeSchema();
