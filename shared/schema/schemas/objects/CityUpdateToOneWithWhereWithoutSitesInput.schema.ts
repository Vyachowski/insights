import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { CityWhereInputObjectSchema as CityWhereInputObjectSchema } from './CityWhereInput.schema';
import { CityUpdateWithoutSitesInputObjectSchema as CityUpdateWithoutSitesInputObjectSchema } from './CityUpdateWithoutSitesInput.schema';
import { CityUncheckedUpdateWithoutSitesInputObjectSchema as CityUncheckedUpdateWithoutSitesInputObjectSchema } from './CityUncheckedUpdateWithoutSitesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CityWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => CityUpdateWithoutSitesInputObjectSchema), z.lazy(() => CityUncheckedUpdateWithoutSitesInputObjectSchema)])
}).strict();
export const CityUpdateToOneWithWhereWithoutSitesInputObjectSchema: z.ZodType<Prisma.CityUpdateToOneWithWhereWithoutSitesInput> = makeSchema() as unknown as z.ZodType<Prisma.CityUpdateToOneWithWhereWithoutSitesInput>;
export const CityUpdateToOneWithWhereWithoutSitesInputObjectZodSchema = makeSchema();
