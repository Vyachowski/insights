import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';


const makeSchema = () => z.object({
  id: z.number().int().optional(),
  name: z.string().optional().nullable(),
  group: z.string().optional().nullable(),
  url: z.string(),
  yandexCounterId: z.string(),
  googleCounterId: z.string().optional().nullable(),
  yandexTagManagerId: z.string().optional().nullable(),
  googleTagManagerId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const SiteCreateManyCityInputObjectSchema: z.ZodType<Prisma.SiteCreateManyCityInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteCreateManyCityInput>;
export const SiteCreateManyCityInputObjectZodSchema = makeSchema();
