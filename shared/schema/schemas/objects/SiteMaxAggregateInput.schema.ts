import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  city_id: z.literal(true).optional(),
  name: z.literal(true).optional(),
  group: z.literal(true).optional(),
  url: z.literal(true).optional(),
  yandex_counter_id: z.literal(true).optional(),
  google_counter_id: z.literal(true).optional(),
  yandex_tag_manager_id: z.literal(true).optional(),
  google_tag_manager_id: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const SiteMaxAggregateInputObjectSchema: z.ZodType<Prisma.SiteMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.SiteMaxAggregateInputType>;
export const SiteMaxAggregateInputObjectZodSchema = makeSchema();
