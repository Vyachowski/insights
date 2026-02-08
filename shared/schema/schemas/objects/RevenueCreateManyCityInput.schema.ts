import * as z from 'zod';
import { Prisma } from '../../../../server/generated/prisma/client';


import { DecimalJSLikeSchema, isValidDecimalInput } from '../../helpers/decimal-helpers';
const makeSchema = () => z.object({
  id: z.number().int().optional(),
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
  updatedAt: z.coerce.date().optional()
}).strict();
export const RevenueCreateManyCityInputObjectSchema: z.ZodType<Prisma.RevenueCreateManyCityInput> = makeSchema() as unknown as z.ZodType<Prisma.RevenueCreateManyCityInput>;
export const RevenueCreateManyCityInputObjectZodSchema = makeSchema();
