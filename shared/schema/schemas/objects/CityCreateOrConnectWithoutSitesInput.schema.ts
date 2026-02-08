import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { CityWhereUniqueInputObjectSchema as CityWhereUniqueInputObjectSchema } from './CityWhereUniqueInput.schema';
import { CityCreateWithoutSitesInputObjectSchema as CityCreateWithoutSitesInputObjectSchema } from './CityCreateWithoutSitesInput.schema';
import { CityUncheckedCreateWithoutSitesInputObjectSchema as CityUncheckedCreateWithoutSitesInputObjectSchema } from './CityUncheckedCreateWithoutSitesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CityWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => CityCreateWithoutSitesInputObjectSchema), z.lazy(() => CityUncheckedCreateWithoutSitesInputObjectSchema)])
}).strict();
export const CityCreateOrConnectWithoutSitesInputObjectSchema: z.ZodType<Prisma.CityCreateOrConnectWithoutSitesInput> = makeSchema() as unknown as z.ZodType<Prisma.CityCreateOrConnectWithoutSitesInput>;
export const CityCreateOrConnectWithoutSitesInputObjectZodSchema = makeSchema();
