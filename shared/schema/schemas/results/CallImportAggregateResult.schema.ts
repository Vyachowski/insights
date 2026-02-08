import * as z from 'zod';
export const CallImportAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    site_id: z.number(),
    date: z.number(),
    src: z.number(),
    region: z.number(),
    call_number: z.number(),
    class: z.number(),
    project_title: z.number(),
    adv_channel_name: z.number(),
    billsec: z.number(),
    comment: z.number(),
    redirect_number: z.number(),
    source: z.number(),
    imported_at: z.number(),
    site: z.number()
  }).optional(),
  _sum: z.object({
    id: z.number().nullable(),
    site_id: z.number().nullable(),
    call_number: z.number().nullable(),
    billsec: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    id: z.number().nullable(),
    site_id: z.number().nullable(),
    call_number: z.number().nullable(),
    billsec: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.number().int().nullable(),
    site_id: z.number().int().nullable(),
    date: z.date().nullable(),
    src: z.string().nullable(),
    region: z.string().nullable(),
    call_number: z.number().int().nullable(),
    class: z.string().nullable(),
    project_title: z.string().nullable(),
    adv_channel_name: z.string().nullable(),
    billsec: z.number().int().nullable(),
    comment: z.string().nullable(),
    redirect_number: z.string().nullable(),
    source: z.string().nullable(),
    imported_at: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.number().int().nullable(),
    site_id: z.number().int().nullable(),
    date: z.date().nullable(),
    src: z.string().nullable(),
    region: z.string().nullable(),
    call_number: z.number().int().nullable(),
    class: z.string().nullable(),
    project_title: z.string().nullable(),
    adv_channel_name: z.string().nullable(),
    billsec: z.number().int().nullable(),
    comment: z.string().nullable(),
    redirect_number: z.string().nullable(),
    source: z.string().nullable(),
    imported_at: z.date().nullable()
  }).nullable().optional()});