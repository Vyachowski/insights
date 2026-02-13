import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { IntFieldUpdateOperationsInputObjectSchema as IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { CallImportUncheckedUpdateManyWithoutSiteNestedInputObjectSchema as CallImportUncheckedUpdateManyWithoutSiteNestedInputObjectSchema } from './CallImportUncheckedUpdateManyWithoutSiteNestedInput.schema';
import { SiteMetricUncheckedUpdateManyWithoutSiteNestedInputObjectSchema as SiteMetricUncheckedUpdateManyWithoutSiteNestedInputObjectSchema } from './SiteMetricUncheckedUpdateManyWithoutSiteNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  cityId: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  group: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  yandexCounterId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  googleCounterId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  yandexTagManagerId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  googleTagManagerId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  callsImport: z.lazy(() => CallImportUncheckedUpdateManyWithoutSiteNestedInputObjectSchema).optional(),
  metrics: z.lazy(() => SiteMetricUncheckedUpdateManyWithoutSiteNestedInputObjectSchema).optional()
}).strict();
export const SiteUncheckedUpdateWithoutCallsInputObjectSchema: z.ZodType<Prisma.SiteUncheckedUpdateWithoutCallsInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteUncheckedUpdateWithoutCallsInput>;
export const SiteUncheckedUpdateWithoutCallsInputObjectZodSchema = makeSchema();
