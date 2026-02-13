import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { CityCreateNestedOneWithoutSitesInputObjectSchema as CityCreateNestedOneWithoutSitesInputObjectSchema } from './CityCreateNestedOneWithoutSitesInput.schema';
import { CallCreateNestedManyWithoutSiteInputObjectSchema as CallCreateNestedManyWithoutSiteInputObjectSchema } from './CallCreateNestedManyWithoutSiteInput.schema';
import { CallImportCreateNestedManyWithoutSiteInputObjectSchema as CallImportCreateNestedManyWithoutSiteInputObjectSchema } from './CallImportCreateNestedManyWithoutSiteInput.schema'

const makeSchema = () => z.object({
  name: z.string().optional().nullable(),
  group: z.string().optional().nullable(),
  url: z.string(),
  yandex_counter_id: z.string(),
  google_counter_id: z.string().optional().nullable(),
  yandex_tag_manager_id: z.string().optional().nullable(),
  google_tag_manager_id: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  city: z.lazy(() => CityCreateNestedOneWithoutSitesInputObjectSchema),
  calls: z.lazy(() => CallCreateNestedManyWithoutSiteInputObjectSchema).optional(),
  callsImport: z.lazy(() => CallImportCreateNestedManyWithoutSiteInputObjectSchema).optional()
}).strict();
export const SiteCreateWithoutMetricsInputObjectSchema: z.ZodType<Prisma.SiteCreateWithoutMetricsInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteCreateWithoutMetricsInput>;
export const SiteCreateWithoutMetricsInputObjectZodSchema = makeSchema();
