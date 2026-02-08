import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteScalarWhereInputObjectSchema as SiteScalarWhereInputObjectSchema } from './SiteScalarWhereInput.schema';
import { SiteUpdateManyMutationInputObjectSchema as SiteUpdateManyMutationInputObjectSchema } from './SiteUpdateManyMutationInput.schema';
import { SiteUncheckedUpdateManyWithoutCityInputObjectSchema as SiteUncheckedUpdateManyWithoutCityInputObjectSchema } from './SiteUncheckedUpdateManyWithoutCityInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => SiteScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => SiteUpdateManyMutationInputObjectSchema), z.lazy(() => SiteUncheckedUpdateManyWithoutCityInputObjectSchema)])
}).strict();
export const SiteUpdateManyWithWhereWithoutCityInputObjectSchema: z.ZodType<Prisma.SiteUpdateManyWithWhereWithoutCityInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteUpdateManyWithWhereWithoutCityInput>;
export const SiteUpdateManyWithWhereWithoutCityInputObjectZodSchema = makeSchema();
