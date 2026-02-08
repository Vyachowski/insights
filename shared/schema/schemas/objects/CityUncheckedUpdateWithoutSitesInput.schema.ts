import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { IntFieldUpdateOperationsInputObjectSchema as IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { RevenueUncheckedUpdateManyWithoutCityNestedInputObjectSchema as RevenueUncheckedUpdateManyWithoutCityNestedInputObjectSchema } from './RevenueUncheckedUpdateManyWithoutCityNestedInput.schema';
import { ExpenseUncheckedUpdateManyWithoutCityNestedInputObjectSchema as ExpenseUncheckedUpdateManyWithoutCityNestedInputObjectSchema } from './ExpenseUncheckedUpdateManyWithoutCityNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  code: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  slug: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  population: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  revenues: z.lazy(() => RevenueUncheckedUpdateManyWithoutCityNestedInputObjectSchema).optional(),
  expenses: z.lazy(() => ExpenseUncheckedUpdateManyWithoutCityNestedInputObjectSchema).optional()
}).strict();
export const CityUncheckedUpdateWithoutSitesInputObjectSchema: z.ZodType<Prisma.CityUncheckedUpdateWithoutSitesInput> = makeSchema() as unknown as z.ZodType<Prisma.CityUncheckedUpdateWithoutSitesInput>;
export const CityUncheckedUpdateWithoutSitesInputObjectZodSchema = makeSchema();
