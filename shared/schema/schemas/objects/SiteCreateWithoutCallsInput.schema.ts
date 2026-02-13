import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { CityCreateNestedOneWithoutSitesInputObjectSchema as CityCreateNestedOneWithoutSitesInputObjectSchema } from './CityCreateNestedOneWithoutSitesInput.schema';
import { CallImportCreateNestedManyWithoutSiteInputObjectSchema as CallImportCreateNestedManyWithoutSiteInputObjectSchema } from './CallImportCreateNestedManyWithoutSiteInput.schema';
import { SiteMetricCreateNestedManyWithoutSiteInputObjectSchema as SiteMetricCreateNestedManyWithoutSiteInputObjectSchema } from './SiteMetricCreateNestedManyWithoutSiteInput.schema'

const makeSchema = () => z.object({
  name: z.string().optional().nullable(),
  group: z.string().optional().nullable(),
  url: z.string(),
  yandexCounterId: z.string(),
  googleCounterId: z.string().optional().nullable(),
  yandexTagManagerId: z.string().optional().nullable(),
  googleTagManagerId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  city: z.lazy(() => CityCreateNestedOneWithoutSitesInputObjectSchema),
  callsImport: z.lazy(() => CallImportCreateNestedManyWithoutSiteInputObjectSchema).optional(),
  metrics: z.lazy(() => SiteMetricCreateNestedManyWithoutSiteInputObjectSchema).optional()
}).strict();
export const SiteCreateWithoutCallsInputObjectSchema: z.ZodType<Prisma.SiteCreateWithoutCallsInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteCreateWithoutCallsInput>;
export const SiteCreateWithoutCallsInputObjectZodSchema = makeSchema();
