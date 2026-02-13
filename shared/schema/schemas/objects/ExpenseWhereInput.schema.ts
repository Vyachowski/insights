import * as z from 'zod';
import { Prisma } from '../../../../server/generated/prisma/client';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { IntNullableFilterObjectSchema as IntNullableFilterObjectSchema } from './IntNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { DecimalFilterObjectSchema as DecimalFilterObjectSchema } from './DecimalFilter.schema';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { CityNullableScalarRelationFilterObjectSchema as CityNullableScalarRelationFilterObjectSchema } from './CityNullableScalarRelationFilter.schema';
import { CityWhereInputObjectSchema as CityWhereInputObjectSchema } from './CityWhereInput.schema'

import { DecimalJSLikeSchema, isValidDecimalInput } from '../../helpers/decimal-helpers';
const expensewhereinputSchema = z.object({
  AND: z.union([z.lazy(() => ExpenseWhereInputObjectSchema), z.lazy(() => ExpenseWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ExpenseWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ExpenseWhereInputObjectSchema), z.lazy(() => ExpenseWhereInputObjectSchema).array()]).optional(),
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
  type: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  comment: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  city: z.union([z.lazy(() => CityNullableScalarRelationFilterObjectSchema), z.lazy(() => CityWhereInputObjectSchema)]).optional()
}).strict();
export const ExpenseWhereInputObjectSchema: z.ZodType<Prisma.ExpenseWhereInput> = expensewhereinputSchema as unknown as z.ZodType<Prisma.ExpenseWhereInput>;
export const ExpenseWhereInputObjectZodSchema = expensewhereinputSchema;
