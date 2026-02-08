import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteCreateWithoutCityInputObjectSchema as SiteCreateWithoutCityInputObjectSchema } from './SiteCreateWithoutCityInput.schema';
import { SiteUncheckedCreateWithoutCityInputObjectSchema as SiteUncheckedCreateWithoutCityInputObjectSchema } from './SiteUncheckedCreateWithoutCityInput.schema';
import { SiteCreateOrConnectWithoutCityInputObjectSchema as SiteCreateOrConnectWithoutCityInputObjectSchema } from './SiteCreateOrConnectWithoutCityInput.schema';
import { SiteUpsertWithWhereUniqueWithoutCityInputObjectSchema as SiteUpsertWithWhereUniqueWithoutCityInputObjectSchema } from './SiteUpsertWithWhereUniqueWithoutCityInput.schema';
import { SiteCreateManyCityInputEnvelopeObjectSchema as SiteCreateManyCityInputEnvelopeObjectSchema } from './SiteCreateManyCityInputEnvelope.schema';
import { SiteWhereUniqueInputObjectSchema as SiteWhereUniqueInputObjectSchema } from './SiteWhereUniqueInput.schema';
import { SiteUpdateWithWhereUniqueWithoutCityInputObjectSchema as SiteUpdateWithWhereUniqueWithoutCityInputObjectSchema } from './SiteUpdateWithWhereUniqueWithoutCityInput.schema';
import { SiteUpdateManyWithWhereWithoutCityInputObjectSchema as SiteUpdateManyWithWhereWithoutCityInputObjectSchema } from './SiteUpdateManyWithWhereWithoutCityInput.schema';
import { SiteScalarWhereInputObjectSchema as SiteScalarWhereInputObjectSchema } from './SiteScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => SiteCreateWithoutCityInputObjectSchema), z.lazy(() => SiteCreateWithoutCityInputObjectSchema).array(), z.lazy(() => SiteUncheckedCreateWithoutCityInputObjectSchema), z.lazy(() => SiteUncheckedCreateWithoutCityInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => SiteCreateOrConnectWithoutCityInputObjectSchema), z.lazy(() => SiteCreateOrConnectWithoutCityInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => SiteUpsertWithWhereUniqueWithoutCityInputObjectSchema), z.lazy(() => SiteUpsertWithWhereUniqueWithoutCityInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => SiteCreateManyCityInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => SiteWhereUniqueInputObjectSchema), z.lazy(() => SiteWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => SiteWhereUniqueInputObjectSchema), z.lazy(() => SiteWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => SiteWhereUniqueInputObjectSchema), z.lazy(() => SiteWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => SiteWhereUniqueInputObjectSchema), z.lazy(() => SiteWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => SiteUpdateWithWhereUniqueWithoutCityInputObjectSchema), z.lazy(() => SiteUpdateWithWhereUniqueWithoutCityInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => SiteUpdateManyWithWhereWithoutCityInputObjectSchema), z.lazy(() => SiteUpdateManyWithWhereWithoutCityInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => SiteScalarWhereInputObjectSchema), z.lazy(() => SiteScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const SiteUncheckedUpdateManyWithoutCityNestedInputObjectSchema: z.ZodType<Prisma.SiteUncheckedUpdateManyWithoutCityNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteUncheckedUpdateManyWithoutCityNestedInput>;
export const SiteUncheckedUpdateManyWithoutCityNestedInputObjectZodSchema = makeSchema();
