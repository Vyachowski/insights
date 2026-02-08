import * as z from 'zod';
import { Prisma } from '../../../../server/generated/prisma/client';
import { CityCreateNestedOneWithoutExpensesInputObjectSchema as CityCreateNestedOneWithoutExpensesInputObjectSchema } from './CityCreateNestedOneWithoutExpensesInput.schema'

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
  type: z.string(),
  comment: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  city: z.lazy(() => CityCreateNestedOneWithoutExpensesInputObjectSchema).optional()
}).strict();
export const ExpenseCreateInputObjectSchema: z.ZodType<Prisma.ExpenseCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.ExpenseCreateInput>;
export const ExpenseCreateInputObjectZodSchema = makeSchema();
