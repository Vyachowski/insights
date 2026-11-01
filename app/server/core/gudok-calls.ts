import { z } from 'zod'

export class GudokPayloadError extends Error {}

export const PROVIDER = 'gudok'
export const WEBHOOK_SOURCE = 'webhook'

const WEBHOOK_MAX_SILENCE_MS = 24 * 60 * 60 * 1000

// Gudok delivers all fields as strings (POST form / GET query) or JSON.
// Only `id` and `date` are strictly required — `id` is the identity/idempotency
// key, `date` places the call in time. Everything else is coerced with a
// sensible default so a partial or unreadable delivery is still stored (collect-all).
const num = z.coerce.number().catch(0)
const str = z.coerce.string()

const payloadSchema = z.object({
  // Coercion alone reads '', ' ' and null as 0, which would merge such calls
  id: z.union([z.number(), z.string().trim().min(1)]).pipe(z.coerce.number<string | number>().int()),
  date: z.string().min(1),
  project_id: num,
  project_title: str.default(''),
  dst: str.default(''),
  adv_channel_id: str.default(''),
  adv_channel_name: str.default(''),
  src: str.default(''),
  billsec: num,
  callstatus: str.default(''),
  region: str.default(''),
  call_number: num,
})

export type GudokPayload = z.infer<typeof payloadSchema>

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

/** Throws GudokPayloadError when the payload is unusable (missing id/date). */
export function parseGudokPayload(raw: Record<string, unknown>) {
  const parsed = payloadSchema.safeParse(raw)
  if (!parsed.success) {
    throw new GudokPayloadError('Invalid Gudok payload')
  }
  const date = parseGudokDate(parsed.data.date)
  if (!date) {
    throw new GudokPayloadError('Invalid Gudok date')
  }
  return { payload: parsed.data, date }
}

/** Over a day since the last webhook call. With none stored there is nothing to measure from. */
export function isWebhookSilent(lastStoredAt: Date | null, now: Date) {
  return lastStoredAt !== null && now.getTime() - lastStoredAt.getTime() > WEBHOOK_MAX_SILENCE_MS
}

export function toNumberDetails(p: GudokPayload) {
  return {
    number: p.dst.replace(/\D/g, '') || null,
    name: p.adv_channel_name || null,
  }
}

interface NumberDetails {
  number: string | null
  name: string | null
}

export function hasNewDetails(known: NumberDetails, { number, name }: NumberDetails) {
  return Boolean((number && number !== known.number) || (name && name !== known.name))
}

export function toCallRow(
  p: GudokPayload,
  date: Date,
  siteId: number | null,
  raw: Record<string, unknown>,
) {
  return {
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
    source: WEBHOOK_SOURCE,
    raw: JSON.stringify(raw),
  }
}
