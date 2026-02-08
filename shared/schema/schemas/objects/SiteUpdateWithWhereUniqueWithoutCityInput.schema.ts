import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteWhereUniqueInputObjectSchema as SiteWhereUniqueInputObjectSchema } from './SiteWhereUniqueInput.schema';
import { SiteUpdateWithoutCityInputObjectSchema as SiteUpdateWithoutCityInputObjectSchema } from './SiteUpdateWithoutCityInput.schema';
import { SiteUncheckedUpdateWithoutCityInputObjectSchema as SiteUncheckedUpdateWithoutCityInputObjectSchema } from './SiteUncheckedUpdateWithoutCityInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => SiteWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => SiteUpdateWithoutCityInputObjectSchema), z.lazy(() => SiteUncheckedUpdateWithoutCityInputObjectSchema)])
}).strict();
export const SiteUpdateWithWhereUniqueWithoutCityInputObjectSchema: z.ZodType<Prisma.SiteUpdateWithWhereUniqueWithoutCityInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteUpdateWithWhereUniqueWithoutCityInput>;
export const SiteUpdateWithWhereUniqueWithoutCityInputObjectZodSchema = makeSchema();
