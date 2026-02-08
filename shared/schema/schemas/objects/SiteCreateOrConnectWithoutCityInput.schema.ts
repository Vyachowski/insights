import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteWhereUniqueInputObjectSchema as SiteWhereUniqueInputObjectSchema } from './SiteWhereUniqueInput.schema';
import { SiteCreateWithoutCityInputObjectSchema as SiteCreateWithoutCityInputObjectSchema } from './SiteCreateWithoutCityInput.schema';
import { SiteUncheckedCreateWithoutCityInputObjectSchema as SiteUncheckedCreateWithoutCityInputObjectSchema } from './SiteUncheckedCreateWithoutCityInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => SiteWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => SiteCreateWithoutCityInputObjectSchema), z.lazy(() => SiteUncheckedCreateWithoutCityInputObjectSchema)])
}).strict();
export const SiteCreateOrConnectWithoutCityInputObjectSchema: z.ZodType<Prisma.SiteCreateOrConnectWithoutCityInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteCreateOrConnectWithoutCityInput>;
export const SiteCreateOrConnectWithoutCityInputObjectZodSchema = makeSchema();
