import * as z from 'zod';
import { Prisma } from '../../../../server/generated/prisma/client';

export const RevenueSchema = z.object({
  id: z.number().int(),
  city_id: z.number().int().nullish(),
  date: z.date(),
  amount: z.instanceof(Prisma.Decimal, {
  message: "Field 'amount' must be a Decimal. Location: ['Models', 'Revenue']",
}),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type RevenueType = z.infer<typeof RevenueSchema>;
