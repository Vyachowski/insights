import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { CityUpdateWithoutSitesInputObjectSchema as CityUpdateWithoutSitesInputObjectSchema } from './CityUpdateWithoutSitesInput.schema';
import { CityUncheckedUpdateWithoutSitesInputObjectSchema as CityUncheckedUpdateWithoutSitesInputObjectSchema } from './CityUncheckedUpdateWithoutSitesInput.schema';
import { CityCreateWithoutSitesInputObjectSchema as CityCreateWithoutSitesInputObjectSchema } from './CityCreateWithoutSitesInput.schema';
import { CityUncheckedCreateWithoutSitesInputObjectSchema as CityUncheckedCreateWithoutSitesInputObjectSchema } from './CityUncheckedCreateWithoutSitesInput.schema';
import { CityWhereInputObjectSchema as CityWhereInputObjectSchema } from './CityWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => CityUpdateWithoutSitesInputObjectSchema), z.lazy(() => CityUncheckedUpdateWithoutSitesInputObjectSchema)]),
  create: z.union([z.lazy(() => CityCreateWithoutSitesInputObjectSchema), z.lazy(() => CityUncheckedCreateWithoutSitesInputObjectSchema)]),
  where: z.lazy(() => CityWhereInputObjectSchema).optional()
}).strict();
export const CityUpsertWithoutSitesInputObjectSchema: z.ZodType<Prisma.CityUpsertWithoutSitesInput> = makeSchema() as unknown as z.ZodType<Prisma.CityUpsertWithoutSitesInput>;
export const CityUpsertWithoutSitesInputObjectZodSchema = makeSchema();
