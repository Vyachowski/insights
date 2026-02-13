import * as z from 'zod';
import { Prisma } from '../../../../server/generated/prisma/client';


import { DecimalJSLikeSchema, isValidDecimalInput } from '../../helpers/decimal-helpers';
const makeSchema = () => z.object({
  id: z.number().int().optional(),
  cityId: z.number().int().optional().nullable(),
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
  createdAt: z.coerce.date().optional()
}).strict();
export const ExpenseUncheckedCreateInputObjectSchema: z.ZodType<Prisma.ExpenseUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.ExpenseUncheckedCreateInput>;
export const ExpenseUncheckedCreateInputObjectZodSchema = makeSchema();
