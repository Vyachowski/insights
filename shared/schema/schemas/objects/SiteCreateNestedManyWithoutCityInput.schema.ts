import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteCreateWithoutCityInputObjectSchema as SiteCreateWithoutCityInputObjectSchema } from './SiteCreateWithoutCityInput.schema';
import { SiteUncheckedCreateWithoutCityInputObjectSchema as SiteUncheckedCreateWithoutCityInputObjectSchema } from './SiteUncheckedCreateWithoutCityInput.schema';
import { SiteCreateOrConnectWithoutCityInputObjectSchema as SiteCreateOrConnectWithoutCityInputObjectSchema } from './SiteCreateOrConnectWithoutCityInput.schema';
import { SiteCreateManyCityInputEnvelopeObjectSchema as SiteCreateManyCityInputEnvelopeObjectSchema } from './SiteCreateManyCityInputEnvelope.schema';
import { SiteWhereUniqueInputObjectSchema as SiteWhereUniqueInputObjectSchema } from './SiteWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => SiteCreateWithoutCityInputObjectSchema), z.lazy(() => SiteCreateWithoutCityInputObjectSchema).array(), z.lazy(() => SiteUncheckedCreateWithoutCityInputObjectSchema), z.lazy(() => SiteUncheckedCreateWithoutCityInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => SiteCreateOrConnectWithoutCityInputObjectSchema), z.lazy(() => SiteCreateOrConnectWithoutCityInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => SiteCreateManyCityInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => SiteWhereUniqueInputObjectSchema), z.lazy(() => SiteWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const SiteCreateNestedManyWithoutCityInputObjectSchema: z.ZodType<Prisma.SiteCreateNestedManyWithoutCityInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteCreateNestedManyWithoutCityInput>;
export const SiteCreateNestedManyWithoutCityInputObjectZodSchema = makeSchema();
