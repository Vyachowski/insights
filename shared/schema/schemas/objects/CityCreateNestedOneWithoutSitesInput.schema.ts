import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { CityCreateWithoutSitesInputObjectSchema as CityCreateWithoutSitesInputObjectSchema } from './CityCreateWithoutSitesInput.schema';
import { CityUncheckedCreateWithoutSitesInputObjectSchema as CityUncheckedCreateWithoutSitesInputObjectSchema } from './CityUncheckedCreateWithoutSitesInput.schema';
import { CityCreateOrConnectWithoutSitesInputObjectSchema as CityCreateOrConnectWithoutSitesInputObjectSchema } from './CityCreateOrConnectWithoutSitesInput.schema';
import { CityWhereUniqueInputObjectSchema as CityWhereUniqueInputObjectSchema } from './CityWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => CityCreateWithoutSitesInputObjectSchema), z.lazy(() => CityUncheckedCreateWithoutSitesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => CityCreateOrConnectWithoutSitesInputObjectSchema).optional(),
  connect: z.lazy(() => CityWhereUniqueInputObjectSchema).optional()
}).strict();
export const CityCreateNestedOneWithoutSitesInputObjectSchema: z.ZodType<Prisma.CityCreateNestedOneWithoutSitesInput> = makeSchema() as unknown as z.ZodType<Prisma.CityCreateNestedOneWithoutSitesInput>;
export const CityCreateNestedOneWithoutSitesInputObjectZodSchema = makeSchema();
