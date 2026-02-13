import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { CallCreateNestedManyWithoutSiteInputObjectSchema as CallCreateNestedManyWithoutSiteInputObjectSchema } from './CallCreateNestedManyWithoutSiteInput.schema';
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
  calls: z.lazy(() => CallCreateNestedManyWithoutSiteInputObjectSchema).optional(),
  callsImport: z.lazy(() => CallImportCreateNestedManyWithoutSiteInputObjectSchema).optional(),
  metrics: z.lazy(() => SiteMetricCreateNestedManyWithoutSiteInputObjectSchema).optional()
}).strict();
export const SiteCreateWithoutCityInputObjectSchema: z.ZodType<Prisma.SiteCreateWithoutCityInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteCreateWithoutCityInput>;
export const SiteCreateWithoutCityInputObjectZodSchema = makeSchema();
