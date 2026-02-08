import * as z from 'zod';
import { Prisma } from '../../../../server/generated/prisma/client';
import { CityCreateNestedOneWithoutRevenuesInputObjectSchema as CityCreateNestedOneWithoutRevenuesInputObjectSchema } from './CityCreateNestedOneWithoutRevenuesInput.schema'

import { DecimalJSLikeSchema, isValidDecimalInput } from '../../helpers/decimal-helpers';
const makeSchema = () => z.object({
  date: z.coerce.date(),
  amount: z.union([
  z.number(),
  z.string(),
  z.instanceof(Prisma.Decimal),
  DecimalJSLikeSchema,
]).refine((v) => isValidDecimalInput(v), {
  message: "Field 'amount' must be a Decimal",
}),
  createdAt: z.coerce.date().optional(),
  city: z.lazy(() => CityCreateNestedOneWithoutRevenuesInputObjectSchema).optional()
}).strict();
export const RevenueCreateInputObjectSchema: z.ZodType<Prisma.RevenueCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.RevenueCreateInput>;
export const RevenueCreateInputObjectZodSchema = makeSchema();
