import * as z from 'zod';
export const RevenueAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    city_id: z.number(),
    date: z.number(),
    amount: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    city: z.number()
  }).optional(),
  _sum: z.object({
    id: z.number().nullable(),
    city_id: z.number().nullable(),
    amount: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    id: z.number().nullable(),
    city_id: z.number().nullable(),
    amount: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.number().int().nullable(),
    city_id: z.number().int().nullable(),
    date: z.date().nullable(),
    amount: z.number().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.number().int().nullable(),
    city_id: z.number().int().nullable(),
    date: z.date().nullable(),
    amount: z.number().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()});