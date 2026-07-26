import { z } from 'zod'

import { resolveSiteIdByProjectTitle } from './resolve-site'

import { db } from '@/server/db'
import { calls } from '@/server/schema'

export class GudokPayloadError extends Error {}

// Gudok delivers all fields as strings (POST form / GET query) or JSON.
// Only `id` and `date` are strictly required — `id` is the identity/idempotency
// key, `date` places the call in time. Everything else is coerced with a
// sensible default so a partial delivery is still stored (collect-all).
const num = z.coerce.number()
const str = z.coerce.string()

const payloadSchema = z.object({
  id: z.coerce.number().int(),
  date: z.string().min(1),
  project_id: num.default(0),
  project_title: str.default(''),
  dst: str.default(''),
  adv_channel_id: str.default(''),
  adv_channel_name: str.default(''),
  src: str.default(''),
  duration: num.default(0),
  billsec: num.default(0),
  callstatus: str.default(''),
  region: str.default(''),
  call_number: num.default(0),
  audio: str.default(''),
})

/** Parse a Gudok `date` (UTC) into a Date; accepts ISO or epoch seconds/ms. */
function parseGudokDate(raw: string): Date | null {
  const trimmed = raw.trim()
  if (/^\d+$/.test(trimmed)) {
    const n = Number(trimmed)
    // 10-digit values are epoch seconds, 13-digit are milliseconds
    const date = new Date(trimmed.length <= 10 ? n * 1000 : n)
    return isNaN(date.getTime()) ? null : date
  }
  const date = new Date(trimmed)
  return isNaN(date.getTime()) ? null : date
}

export interface IngestResult {
  stored: boolean
  duplicate: boolean
  gudokId: number
  siteId: number | null
}

/**
 * Validate a raw Gudok webhook payload, resolve its site best-effort, and
 * store it in `calls`. Idempotent on `gudokId`: a repeated delivery is a no-op.
 * Throws GudokPayloadError when the payload is unusable (missing id/date).
 */
export async function ingestGudokCall(
  raw: Record<string, unknown>,
): Promise<IngestResult> {
  const parsed = payloadSchema.safeParse(raw)
  if (!parsed.success) {
    throw new GudokPayloadError('Invalid Gudok payload')
  }
  const p = parsed.data
  const date = parseGudokDate(p.date)
  if (!date) {
    throw new GudokPayloadError('Invalid Gudok date')
  }

  const siteId = await resolveSiteIdByProjectTitle(p.project_title)

  const inserted = await db
    .insert(calls)
    .values({
      siteId,
      gudokId: p.id,
      projectId: p.project_id,
      projectTitle: p.project_title,
      dst: p.dst,
      advChannelId: p.adv_channel_id,
      advChannelName: p.adv_channel_name,
      src: p.src,
      duration: p.duration,
      billsec: p.billsec,
      callstatus: p.callstatus,
      date,
      region: p.region,
      callNumber: p.call_number,
      audio: p.audio,
      source: 'webhook',
      raw: JSON.stringify(raw),
    })
    .onConflictDoNothing({ target: calls.gudokId })
    .returning({ id: calls.id })

  return {
    stored: inserted.length > 0,
    duplicate: inserted.length === 0,
    gudokId: p.id,
    siteId,
  }
}
