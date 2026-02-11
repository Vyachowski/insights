import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { CallUpdateManyWithoutSiteNestedInputObjectSchema as CallUpdateManyWithoutSiteNestedInputObjectSchema } from './CallUpdateManyWithoutSiteNestedInput.schema';
import { CallImportUpdateManyWithoutSiteNestedInputObjectSchema as CallImportUpdateManyWithoutSiteNestedInputObjectSchema } from './CallImportUpdateManyWithoutSiteNestedInput.schema';
import { SiteMetricUpdateManyWithoutSiteNestedInputObjectSchema as SiteMetricUpdateManyWithoutSiteNestedInputObjectSchema } from './SiteMetricUpdateManyWithoutSiteNestedInput.schema'

const makeSchema = () => z.object({
  name: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  group: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  yandex_counter_id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  google_counter_id: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  yandex_tag_manager_id: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  google_tag_manager_id: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  calls: z.lazy(() => CallUpdateManyWithoutSiteNestedInputObjectSchema).optional(),
  callsRaw: z.lazy(() => CallImportUpdateManyWithoutSiteNestedInputObjectSchema).optional(),
  metrics: z.lazy(() => SiteMetricUpdateManyWithoutSiteNestedInputObjectSchema).optional()
}).strict();
export const SiteUpdateWithoutCityInputObjectSchema: z.ZodType<Prisma.SiteUpdateWithoutCityInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteUpdateWithoutCityInput>;
export const SiteUpdateWithoutCityInputObjectZodSchema = makeSchema();
