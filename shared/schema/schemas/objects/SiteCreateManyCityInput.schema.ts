import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';


const makeSchema = () => z.object({
  id: z.number().int().optional(),
  name: z.string(),
  url: z.string(),
  yandex_counter_id: z.string(),
  google_counter_id: z.string().optional().nullable(),
  yandex_tag_manager_id: z.string().optional().nullable(),
  google_tag_manager_id: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const SiteCreateManyCityInputObjectSchema: z.ZodType<Prisma.SiteCreateManyCityInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteCreateManyCityInput>;
export const SiteCreateManyCityInputObjectZodSchema = makeSchema();
