import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { IntFieldUpdateOperationsInputObjectSchema as IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { RevenueUpdateManyWithoutCityNestedInputObjectSchema as RevenueUpdateManyWithoutCityNestedInputObjectSchema } from './RevenueUpdateManyWithoutCityNestedInput.schema';
import { ExpenseUpdateManyWithoutCityNestedInputObjectSchema as ExpenseUpdateManyWithoutCityNestedInputObjectSchema } from './ExpenseUpdateManyWithoutCityNestedInput.schema'

const makeSchema = () => z.object({
  code: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  slug: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  population: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  revenues: z.lazy(() => RevenueUpdateManyWithoutCityNestedInputObjectSchema).optional(),
  expenses: z.lazy(() => ExpenseUpdateManyWithoutCityNestedInputObjectSchema).optional()
}).strict();
export const CityUpdateWithoutSitesInputObjectSchema: z.ZodType<Prisma.CityUpdateWithoutSitesInput> = makeSchema() as unknown as z.ZodType<Prisma.CityUpdateWithoutSitesInput>;
export const CityUpdateWithoutSitesInputObjectZodSchema = makeSchema();
