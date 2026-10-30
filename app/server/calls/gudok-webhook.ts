import { and, eq } from 'drizzle-orm'
import { z } from 'zod'

import { resolveSiteIdByGudokProject, resolveSiteIdByProjectTitle } from './resolve-site'

import { db } from '@/server/db'
import { calls, phoneNumbers } from '@/server/schema'

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
  billsec: num.default(0),
  callstatus: str.default(''),
  region: str.default(''),
  call_number: num.default(0),
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

type GudokPayload = z.infer<typeof payloadSchema>

const PROVIDER = 'gudok'

async function resolveSiteId(p: GudokPayload): Promise<number | null> {
  return (await resolveSiteIdByGudokProject(p.project_id))
    ?? (await resolveSiteIdByProjectTitle(p.project_title))
}

/**
 * Create the call's number, or update `number` and `name` on a known one.
 * `site_id` of a known number changes by hand only, so a project edit in Gudok
 * can't move calls. Returns the site the call belongs to.
 */
async function syncPhoneNumber(p: GudokPayload): Promise<number | null> {
  // The call is stored whatever happens here, so failures are only logged
  let siteId: number | null = null
  try {
    if (!p.adv_channel_id) return await resolveSiteId(p)

    const key = and(
      eq(phoneNumbers.provider, PROVIDER),
      eq(phoneNumbers.providerNumberId, p.adv_channel_id),
    )
    const [known] = await db.select().from(phoneNumbers).where(key)
    siteId = known ? known.siteId : await resolveSiteId(p)

    const number = p.dst.replace(/\D/g, '') || null
    const name = p.adv_channel_name || null
    if (!known) {
      await db.insert(phoneNumbers).values({
        provider: PROVIDER,
        providerNumberId: p.adv_channel_id,
        number,
        siteId,
        name,
      })
    } else if ((number && number !== known.number) || (name && name !== known.name)) {
      await db
        .update(phoneNumbers)
        .set({ number: number ?? known.number, name: name ?? known.name })
        .where(key)
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`[gudok-webhook] number ${p.adv_channel_id} failed: ${message}`)
  }
  return siteId
}

export interface IngestResult {
  stored: boolean
  duplicate: boolean
  gudokId: number
  siteId: number | null
}

/**
 * Validate a raw Gudok webhook payload, keep its number up to date, and store
 * it in `calls`. Idempotent: a repeated delivery stores nothing new.
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

  const siteId = await syncPhoneNumber(p)

  const inserted = await db
    .insert(calls)
    .values({
      siteId,
      provider: PROVIDER,
      providerNumberId: p.adv_channel_id || null,
      providerCallId: String(p.id),
      src: p.src,
      callNumber: p.call_number,
      date,
      callstatus: p.callstatus,
      billsec: p.billsec,
      region: p.region,
      source: 'webhook',
      raw: JSON.stringify(raw),
    })
    // No target: a CSV row already holding this call is also a duplicate
    .onConflictDoNothing()
    .returning({ id: calls.id })

  return {
    stored: inserted.length > 0,
    duplicate: inserted.length === 0,
    gudokId: p.id,
    siteId,
  }
}
