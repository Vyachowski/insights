import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { IntFieldUpdateOperationsInputObjectSchema as IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { CallUncheckedUpdateManyWithoutSiteNestedInputObjectSchema as CallUncheckedUpdateManyWithoutSiteNestedInputObjectSchema } from './CallUncheckedUpdateManyWithoutSiteNestedInput.schema';
import { CallImportUncheckedUpdateManyWithoutSiteNestedInputObjectSchema as CallImportUncheckedUpdateManyWithoutSiteNestedInputObjectSchema } from './CallImportUncheckedUpdateManyWithoutSiteNestedInput.schema';
import { SiteMetricUncheckedUpdateManyWithoutSiteNestedInputObjectSchema as SiteMetricUncheckedUpdateManyWithoutSiteNestedInputObjectSchema } from './SiteMetricUncheckedUpdateManyWithoutSiteNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  city_id: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  yandex_counter_id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  google_counter_id: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  yandex_tag_manager_id: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  google_tag_manager_id: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  calls: z.lazy(() => CallUncheckedUpdateManyWithoutSiteNestedInputObjectSchema).optional(),
  callsRaw: z.lazy(() => CallImportUncheckedUpdateManyWithoutSiteNestedInputObjectSchema).optional(),
  metrics: z.lazy(() => SiteMetricUncheckedUpdateManyWithoutSiteNestedInputObjectSchema).optional()
}).strict();
export const SiteUncheckedUpdateInputObjectSchema: z.ZodType<Prisma.SiteUncheckedUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteUncheckedUpdateInput>;
export const SiteUncheckedUpdateInputObjectZodSchema = makeSchema();
