import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const sitescalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => SiteScalarWhereInputObjectSchema), z.lazy(() => SiteScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => SiteScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => SiteScalarWhereInputObjectSchema), z.lazy(() => SiteScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  cityId: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  name: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  group: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  url: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  yandexCounterId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  googleCounterId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  yandexTagManagerId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  googleTagManagerId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const SiteScalarWhereInputObjectSchema: z.ZodType<Prisma.SiteScalarWhereInput> = sitescalarwhereinputSchema as unknown as z.ZodType<Prisma.SiteScalarWhereInput>;
export const SiteScalarWhereInputObjectZodSchema = sitescalarwhereinputSchema;
