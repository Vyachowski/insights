import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteMetricWhereUniqueInputObjectSchema as SiteMetricWhereUniqueInputObjectSchema } from './SiteMetricWhereUniqueInput.schema';
import { SiteMetricUpdateWithoutSiteInputObjectSchema as SiteMetricUpdateWithoutSiteInputObjectSchema } from './SiteMetricUpdateWithoutSiteInput.schema';
import { SiteMetricUncheckedUpdateWithoutSiteInputObjectSchema as SiteMetricUncheckedUpdateWithoutSiteInputObjectSchema } from './SiteMetricUncheckedUpdateWithoutSiteInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => SiteMetricWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => SiteMetricUpdateWithoutSiteInputObjectSchema), z.lazy(() => SiteMetricUncheckedUpdateWithoutSiteInputObjectSchema)])
}).strict();
export const SiteMetricUpdateWithWhereUniqueWithoutSiteInputObjectSchema: z.ZodType<Prisma.SiteMetricUpdateWithWhereUniqueWithoutSiteInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteMetricUpdateWithWhereUniqueWithoutSiteInput>;
export const SiteMetricUpdateWithWhereUniqueWithoutSiteInputObjectZodSchema = makeSchema();
