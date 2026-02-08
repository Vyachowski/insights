import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { RevenueWhereUniqueInputObjectSchema as RevenueWhereUniqueInputObjectSchema } from './RevenueWhereUniqueInput.schema';
import { RevenueCreateWithoutCityInputObjectSchema as RevenueCreateWithoutCityInputObjectSchema } from './RevenueCreateWithoutCityInput.schema';
import { RevenueUncheckedCreateWithoutCityInputObjectSchema as RevenueUncheckedCreateWithoutCityInputObjectSchema } from './RevenueUncheckedCreateWithoutCityInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => RevenueWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => RevenueCreateWithoutCityInputObjectSchema), z.lazy(() => RevenueUncheckedCreateWithoutCityInputObjectSchema)])
}).strict();
export const RevenueCreateOrConnectWithoutCityInputObjectSchema: z.ZodType<Prisma.RevenueCreateOrConnectWithoutCityInput> = makeSchema() as unknown as z.ZodType<Prisma.RevenueCreateOrConnectWithoutCityInput>;
export const RevenueCreateOrConnectWithoutCityInputObjectZodSchema = makeSchema();
