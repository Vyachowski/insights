import * as z from 'zod';
import { Prisma } from '../../../../server/generated/prisma/client';
import { IntWithAggregatesFilterObjectSchema as IntWithAggregatesFilterObjectSchema } from './IntWithAggregatesFilter.schema';
import { IntNullableWithAggregatesFilterObjectSchema as IntNullableWithAggregatesFilterObjectSchema } from './IntNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema';
import { DecimalWithAggregatesFilterObjectSchema as DecimalWithAggregatesFilterObjectSchema } from './DecimalWithAggregatesFilter.schema'

import { DecimalJSLikeSchema, isValidDecimalInput } from '../../helpers/decimal-helpers';
const revenuescalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => RevenueScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => RevenueScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => RevenueScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => RevenueScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => RevenueScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  cityId: z.union([z.lazy(() => IntNullableWithAggregatesFilterObjectSchema), z.number().int()]).optional().nullable(),
  date: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  amount: z.union([z.lazy(() => DecimalWithAggregatesFilterObjectSchema), z.union([
  z.number(),
  z.string(),
  z.instanceof(Prisma.Decimal),
  DecimalJSLikeSchema,
]).refine((v) => isValidDecimalInput(v), {
  message: "Field 'amount' must be a Decimal",
})]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const RevenueScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.RevenueScalarWhereWithAggregatesInput> = revenuescalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.RevenueScalarWhereWithAggregatesInput>;
export const RevenueScalarWhereWithAggregatesInputObjectZodSchema = revenuescalarwherewithaggregatesinputSchema;
