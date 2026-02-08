import * as z from 'zod';
import { Prisma } from '../../../../server/generated/prisma/client';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { DecimalFieldUpdateOperationsInputObjectSchema as DecimalFieldUpdateOperationsInputObjectSchema } from './DecimalFieldUpdateOperationsInput.schema';
import { CityUpdateOneWithoutRevenuesNestedInputObjectSchema as CityUpdateOneWithoutRevenuesNestedInputObjectSchema } from './CityUpdateOneWithoutRevenuesNestedInput.schema'

import { DecimalJSLikeSchema, isValidDecimalInput } from '../../helpers/decimal-helpers';
const makeSchema = () => z.object({
  date: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  amount: z.union([z.union([
  z.number(),
  z.string(),
  z.instanceof(Prisma.Decimal),
  DecimalJSLikeSchema,
]).refine((v) => isValidDecimalInput(v), {
  message: "Field 'amount' must be a Decimal",
}), z.lazy(() => DecimalFieldUpdateOperationsInputObjectSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  city: z.lazy(() => CityUpdateOneWithoutRevenuesNestedInputObjectSchema).optional()
}).strict();
export const RevenueUpdateInputObjectSchema: z.ZodType<Prisma.RevenueUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.RevenueUpdateInput>;
export const RevenueUpdateInputObjectZodSchema = makeSchema();
