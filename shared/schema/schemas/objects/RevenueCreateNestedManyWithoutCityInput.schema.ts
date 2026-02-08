import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { RevenueCreateWithoutCityInputObjectSchema as RevenueCreateWithoutCityInputObjectSchema } from './RevenueCreateWithoutCityInput.schema';
import { RevenueUncheckedCreateWithoutCityInputObjectSchema as RevenueUncheckedCreateWithoutCityInputObjectSchema } from './RevenueUncheckedCreateWithoutCityInput.schema';
import { RevenueCreateOrConnectWithoutCityInputObjectSchema as RevenueCreateOrConnectWithoutCityInputObjectSchema } from './RevenueCreateOrConnectWithoutCityInput.schema';
import { RevenueCreateManyCityInputEnvelopeObjectSchema as RevenueCreateManyCityInputEnvelopeObjectSchema } from './RevenueCreateManyCityInputEnvelope.schema';
import { RevenueWhereUniqueInputObjectSchema as RevenueWhereUniqueInputObjectSchema } from './RevenueWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => RevenueCreateWithoutCityInputObjectSchema), z.lazy(() => RevenueCreateWithoutCityInputObjectSchema).array(), z.lazy(() => RevenueUncheckedCreateWithoutCityInputObjectSchema), z.lazy(() => RevenueUncheckedCreateWithoutCityInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => RevenueCreateOrConnectWithoutCityInputObjectSchema), z.lazy(() => RevenueCreateOrConnectWithoutCityInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => RevenueCreateManyCityInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => RevenueWhereUniqueInputObjectSchema), z.lazy(() => RevenueWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const RevenueCreateNestedManyWithoutCityInputObjectSchema: z.ZodType<Prisma.RevenueCreateNestedManyWithoutCityInput> = makeSchema() as unknown as z.ZodType<Prisma.RevenueCreateNestedManyWithoutCityInput>;
export const RevenueCreateNestedManyWithoutCityInputObjectZodSchema = makeSchema();
