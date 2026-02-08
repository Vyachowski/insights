import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { CallUncheckedCreateNestedManyWithoutSiteInputObjectSchema as CallUncheckedCreateNestedManyWithoutSiteInputObjectSchema } from './CallUncheckedCreateNestedManyWithoutSiteInput.schema';
import { CallImportUncheckedCreateNestedManyWithoutSiteInputObjectSchema as CallImportUncheckedCreateNestedManyWithoutSiteInputObjectSchema } from './CallImportUncheckedCreateNestedManyWithoutSiteInput.schema';
import { SiteMetricUncheckedCreateNestedManyWithoutSiteInputObjectSchema as SiteMetricUncheckedCreateNestedManyWithoutSiteInputObjectSchema } from './SiteMetricUncheckedCreateNestedManyWithoutSiteInput.schema'

const makeSchema = () => z.object({
  id: z.number().int().optional(),
  city_id: z.number().int(),
  name: z.string(),
  url: z.string(),
  yandex_counter_id: z.string(),
  google_counter_id: z.string().optional().nullable(),
  yandex_tag_manager_id: z.string().optional().nullable(),
  google_tag_manager_id: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  calls: z.lazy(() => CallUncheckedCreateNestedManyWithoutSiteInputObjectSchema).optional(),
  callsRaw: z.lazy(() => CallImportUncheckedCreateNestedManyWithoutSiteInputObjectSchema).optional(),
  metrics: z.lazy(() => SiteMetricUncheckedCreateNestedManyWithoutSiteInputObjectSchema).optional()
}).strict();
export const SiteUncheckedCreateInputObjectSchema: z.ZodType<Prisma.SiteUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteUncheckedCreateInput>;
export const SiteUncheckedCreateInputObjectZodSchema = makeSchema();
