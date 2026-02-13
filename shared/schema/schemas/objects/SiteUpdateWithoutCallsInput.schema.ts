import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { CityUpdateOneRequiredWithoutSitesNestedInputObjectSchema as CityUpdateOneRequiredWithoutSitesNestedInputObjectSchema } from './CityUpdateOneRequiredWithoutSitesNestedInput.schema';
import { CallImportUpdateManyWithoutSiteNestedInputObjectSchema as CallImportUpdateManyWithoutSiteNestedInputObjectSchema } from './CallImportUpdateManyWithoutSiteNestedInput.schema';
import { SiteMetricUpdateManyWithoutSiteNestedInputObjectSchema as SiteMetricUpdateManyWithoutSiteNestedInputObjectSchema } from './SiteMetricUpdateManyWithoutSiteNestedInput.schema'

const makeSchema = () => z.object({
  name: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  group: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  yandexCounterId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  googleCounterId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  yandexTagManagerId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  googleTagManagerId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  city: z.lazy(() => CityUpdateOneRequiredWithoutSitesNestedInputObjectSchema).optional(),
  callsImport: z.lazy(() => CallImportUpdateManyWithoutSiteNestedInputObjectSchema).optional(),
  metrics: z.lazy(() => SiteMetricUpdateManyWithoutSiteNestedInputObjectSchema).optional()
}).strict();
export const SiteUpdateWithoutCallsInputObjectSchema: z.ZodType<Prisma.SiteUpdateWithoutCallsInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteUpdateWithoutCallsInput>;
export const SiteUpdateWithoutCallsInputObjectZodSchema = makeSchema();
