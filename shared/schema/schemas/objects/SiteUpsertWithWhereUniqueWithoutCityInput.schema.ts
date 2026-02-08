import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteWhereUniqueInputObjectSchema as SiteWhereUniqueInputObjectSchema } from './SiteWhereUniqueInput.schema';
import { SiteUpdateWithoutCityInputObjectSchema as SiteUpdateWithoutCityInputObjectSchema } from './SiteUpdateWithoutCityInput.schema';
import { SiteUncheckedUpdateWithoutCityInputObjectSchema as SiteUncheckedUpdateWithoutCityInputObjectSchema } from './SiteUncheckedUpdateWithoutCityInput.schema';
import { SiteCreateWithoutCityInputObjectSchema as SiteCreateWithoutCityInputObjectSchema } from './SiteCreateWithoutCityInput.schema';
import { SiteUncheckedCreateWithoutCityInputObjectSchema as SiteUncheckedCreateWithoutCityInputObjectSchema } from './SiteUncheckedCreateWithoutCityInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => SiteWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => SiteUpdateWithoutCityInputObjectSchema), z.lazy(() => SiteUncheckedUpdateWithoutCityInputObjectSchema)]),
  create: z.union([z.lazy(() => SiteCreateWithoutCityInputObjectSchema), z.lazy(() => SiteUncheckedCreateWithoutCityInputObjectSchema)])
}).strict();
export const SiteUpsertWithWhereUniqueWithoutCityInputObjectSchema: z.ZodType<Prisma.SiteUpsertWithWhereUniqueWithoutCityInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteUpsertWithWhereUniqueWithoutCityInput>;
export const SiteUpsertWithWhereUniqueWithoutCityInputObjectZodSchema = makeSchema();
