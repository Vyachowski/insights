import * as z from 'zod';
import { Prisma } from '../../../../server/generated/prisma/client';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { IntNullableFilterObjectSchema as IntNullableFilterObjectSchema } from './IntNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { DecimalFilterObjectSchema as DecimalFilterObjectSchema } from './DecimalFilter.schema'

import { DecimalJSLikeSchema, isValidDecimalInput } from '../../helpers/decimal-helpers';
const revenuescalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => RevenueScalarWhereInputObjectSchema), z.lazy(() => RevenueScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => RevenueScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => RevenueScalarWhereInputObjectSchema), z.lazy(() => RevenueScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  cityId: z.union([z.lazy(() => IntNullableFilterObjectSchema), z.number().int()]).optional().nullable(),
  date: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  amount: z.union([z.lazy(() => DecimalFilterObjectSchema), z.union([
  z.number(),
  z.string(),
  z.instanceof(Prisma.Decimal),
  DecimalJSLikeSchema,
]).refine((v) => isValidDecimalInput(v), {
  message: "Field 'amount' must be a Decimal",
})]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const RevenueScalarWhereInputObjectSchema: z.ZodType<Prisma.RevenueScalarWhereInput> = revenuescalarwhereinputSchema as unknown as z.ZodType<Prisma.RevenueScalarWhereInput>;
export const RevenueScalarWhereInputObjectZodSchema = revenuescalarwhereinputSchema;
