import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { CallUncheckedCreateNestedManyWithoutSiteInputObjectSchema as CallUncheckedCreateNestedManyWithoutSiteInputObjectSchema } from './CallUncheckedCreateNestedManyWithoutSiteInput.schema';
import { CallImportUncheckedCreateNestedManyWithoutSiteInputObjectSchema as CallImportUncheckedCreateNestedManyWithoutSiteInputObjectSchema } from './CallImportUncheckedCreateNestedManyWithoutSiteInput.schema';
import { SiteMetricUncheckedCreateNestedManyWithoutSiteInputObjectSchema as SiteMetricUncheckedCreateNestedManyWithoutSiteInputObjectSchema } from './SiteMetricUncheckedCreateNestedManyWithoutSiteInput.schema'

const makeSchema = () => z.object({
  id: z.number().int().optional(),
  name: z.string().optional().nullable(),
  group: z.string().optional().nullable(),
  url: z.string(),
  yandexCounterId: z.string(),
  googleCounterId: z.string().optional().nullable(),
  yandexTagManagerId: z.string().optional().nullable(),
  googleTagManagerId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  calls: z.lazy(() => CallUncheckedCreateNestedManyWithoutSiteInputObjectSchema).optional(),
  callsImport: z.lazy(() => CallImportUncheckedCreateNestedManyWithoutSiteInputObjectSchema).optional(),
  metrics: z.lazy(() => SiteMetricUncheckedCreateNestedManyWithoutSiteInputObjectSchema).optional()
}).strict();
export const SiteUncheckedCreateWithoutCityInputObjectSchema: z.ZodType<Prisma.SiteUncheckedCreateWithoutCityInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteUncheckedCreateWithoutCityInput>;
export const SiteUncheckedCreateWithoutCityInputObjectZodSchema = makeSchema();
