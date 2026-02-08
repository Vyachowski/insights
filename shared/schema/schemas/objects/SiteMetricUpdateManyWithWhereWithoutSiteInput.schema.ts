import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteMetricScalarWhereInputObjectSchema as SiteMetricScalarWhereInputObjectSchema } from './SiteMetricScalarWhereInput.schema';
import { SiteMetricUpdateManyMutationInputObjectSchema as SiteMetricUpdateManyMutationInputObjectSchema } from './SiteMetricUpdateManyMutationInput.schema';
import { SiteMetricUncheckedUpdateManyWithoutSiteInputObjectSchema as SiteMetricUncheckedUpdateManyWithoutSiteInputObjectSchema } from './SiteMetricUncheckedUpdateManyWithoutSiteInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => SiteMetricScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => SiteMetricUpdateManyMutationInputObjectSchema), z.lazy(() => SiteMetricUncheckedUpdateManyWithoutSiteInputObjectSchema)])
}).strict();
export const SiteMetricUpdateManyWithWhereWithoutSiteInputObjectSchema: z.ZodType<Prisma.SiteMetricUpdateManyWithWhereWithoutSiteInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteMetricUpdateManyWithWhereWithoutSiteInput>;
export const SiteMetricUpdateManyWithWhereWithoutSiteInputObjectZodSchema = makeSchema();
