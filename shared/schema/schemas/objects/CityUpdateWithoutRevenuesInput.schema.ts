import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { IntFieldUpdateOperationsInputObjectSchema as IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { SiteUpdateManyWithoutCityNestedInputObjectSchema as SiteUpdateManyWithoutCityNestedInputObjectSchema } from './SiteUpdateManyWithoutCityNestedInput.schema';
import { ExpenseUpdateManyWithoutCityNestedInputObjectSchema as ExpenseUpdateManyWithoutCityNestedInputObjectSchema } from './ExpenseUpdateManyWithoutCityNestedInput.schema'

const makeSchema = () => z.object({
  code: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  slug: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  population: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  sites: z.lazy(() => SiteUpdateManyWithoutCityNestedInputObjectSchema).optional(),
  expenses: z.lazy(() => ExpenseUpdateManyWithoutCityNestedInputObjectSchema).optional()
}).strict();
export const CityUpdateWithoutRevenuesInputObjectSchema: z.ZodType<Prisma.CityUpdateWithoutRevenuesInput> = makeSchema() as unknown as z.ZodType<Prisma.CityUpdateWithoutRevenuesInput>;
export const CityUpdateWithoutRevenuesInputObjectZodSchema = makeSchema();
