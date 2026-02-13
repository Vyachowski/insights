import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  cityId: z.literal(true).optional(),
  name: z.literal(true).optional(),
  group: z.literal(true).optional(),
  url: z.literal(true).optional(),
  yandexCounterId: z.literal(true).optional(),
  googleCounterId: z.literal(true).optional(),
  yandexTagManagerId: z.literal(true).optional(),
  googleTagManagerId: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const SiteMaxAggregateInputObjectSchema: z.ZodType<Prisma.SiteMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.SiteMaxAggregateInputType>;
export const SiteMaxAggregateInputObjectZodSchema = makeSchema();
