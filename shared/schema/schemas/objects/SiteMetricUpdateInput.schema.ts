import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { IntFieldUpdateOperationsInputObjectSchema as IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { FloatFieldUpdateOperationsInputObjectSchema as FloatFieldUpdateOperationsInputObjectSchema } from './FloatFieldUpdateOperationsInput.schema';
import { SiteUpdateOneRequiredWithoutMetricsNestedInputObjectSchema as SiteUpdateOneRequiredWithoutMetricsNestedInputObjectSchema } from './SiteUpdateOneRequiredWithoutMetricsNestedInput.schema'

const makeSchema = () => z.object({
  date: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  yandexUsers: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  googleUsers: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  otherUsers: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  visitDurationYandexInSec: z.union([z.number(), z.lazy(() => FloatFieldUpdateOperationsInputObjectSchema)]).optional(),
  visitDurationGoogleInSec: z.union([z.number(), z.lazy(() => FloatFieldUpdateOperationsInputObjectSchema)]).optional(),
  visitDurationOtherInSec: z.union([z.number(), z.lazy(() => FloatFieldUpdateOperationsInputObjectSchema)]).optional(),
  bounceYandex: z.union([z.number(), z.lazy(() => FloatFieldUpdateOperationsInputObjectSchema)]).optional(),
  bounceGoogle: z.union([z.number(), z.lazy(() => FloatFieldUpdateOperationsInputObjectSchema)]).optional(),
  bounceOther: z.union([z.number(), z.lazy(() => FloatFieldUpdateOperationsInputObjectSchema)]).optional(),
  leadsYandex: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  leadsGoogle: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  leadsOther: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  site: z.lazy(() => SiteUpdateOneRequiredWithoutMetricsNestedInputObjectSchema).optional()
}).strict();
export const SiteMetricUpdateInputObjectSchema: z.ZodType<Prisma.SiteMetricUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteMetricUpdateInput>;
export const SiteMetricUpdateInputObjectZodSchema = makeSchema();
