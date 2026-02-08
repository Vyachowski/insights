import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { CityCreateWithoutSitesInputObjectSchema as CityCreateWithoutSitesInputObjectSchema } from './CityCreateWithoutSitesInput.schema';
import { CityUncheckedCreateWithoutSitesInputObjectSchema as CityUncheckedCreateWithoutSitesInputObjectSchema } from './CityUncheckedCreateWithoutSitesInput.schema';
import { CityCreateOrConnectWithoutSitesInputObjectSchema as CityCreateOrConnectWithoutSitesInputObjectSchema } from './CityCreateOrConnectWithoutSitesInput.schema';
import { CityUpsertWithoutSitesInputObjectSchema as CityUpsertWithoutSitesInputObjectSchema } from './CityUpsertWithoutSitesInput.schema';
import { CityWhereUniqueInputObjectSchema as CityWhereUniqueInputObjectSchema } from './CityWhereUniqueInput.schema';
import { CityUpdateToOneWithWhereWithoutSitesInputObjectSchema as CityUpdateToOneWithWhereWithoutSitesInputObjectSchema } from './CityUpdateToOneWithWhereWithoutSitesInput.schema';
import { CityUpdateWithoutSitesInputObjectSchema as CityUpdateWithoutSitesInputObjectSchema } from './CityUpdateWithoutSitesInput.schema';
import { CityUncheckedUpdateWithoutSitesInputObjectSchema as CityUncheckedUpdateWithoutSitesInputObjectSchema } from './CityUncheckedUpdateWithoutSitesInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => CityCreateWithoutSitesInputObjectSchema), z.lazy(() => CityUncheckedCreateWithoutSitesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => CityCreateOrConnectWithoutSitesInputObjectSchema).optional(),
  upsert: z.lazy(() => CityUpsertWithoutSitesInputObjectSchema).optional(),
  connect: z.lazy(() => CityWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => CityUpdateToOneWithWhereWithoutSitesInputObjectSchema), z.lazy(() => CityUpdateWithoutSitesInputObjectSchema), z.lazy(() => CityUncheckedUpdateWithoutSitesInputObjectSchema)]).optional()
}).strict();
export const CityUpdateOneRequiredWithoutSitesNestedInputObjectSchema: z.ZodType<Prisma.CityUpdateOneRequiredWithoutSitesNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.CityUpdateOneRequiredWithoutSitesNestedInput>;
export const CityUpdateOneRequiredWithoutSitesNestedInputObjectZodSchema = makeSchema();
