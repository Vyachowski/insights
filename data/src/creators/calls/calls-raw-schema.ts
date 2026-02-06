import { z } from "zod";

/**
 * Schema for calls_raw table - data from CSV exports
 * Matches Gudok API structure where possible
 */
export const CallRawSchema = z.object({
  // Primary key - auto-increment in database
  // id: number (handled by DB)

  // Foreign key to sites table
  site_id: z.number().positive(),

  // Call data from Gudok API structure
  date: z.string(), // ISO 8601 format
  src: z.string().min(1), // caller number (Кто звонил)
  region: z.string().nullable(), // caller region (Откуда)
  call_number: z.number().int().positive(), // call order (№)
  class: z.string().nullable(), // call class (Класс) - e.g., "Лид"
  project_title: z.string().min(1), // project name (Проект)
  adv_channel_name: z.string().min(1), // channel name (Куда звонил)
  billsec: z.number().int().min(0), // call duration in seconds (Запись)
  comment: z.string().nullable(), // comment (Комментарий)
  redirect_number: z.string().nullable(), // redirect number (Вызов завершен)

  // Metadata
  source: z.literal("csv"),
  imported_at: z.string(), // ISO 8601 format
});

export type CallRaw = z.infer<typeof CallRawSchema>;

/**
 * Input data from CSV before processing
 */
export const CSVCallRowSchema = z.object({
  Дата: z.string(),
  "Кто звонил": z.string(),
  Откуда: z.string().optional(),
  "№": z.string(),
  Класс: z.string().optional(),
  Проект: z.string(),
  "Куда звонил": z.string(),
  Запись: z.string().optional(),
  Комментарий: z.string().optional(),
  "Вызов завершен": z.string().optional(),
});

export type CSVCallRow = z.infer<typeof CSVCallRowSchema>;
