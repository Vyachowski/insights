import { z } from 'zod'

export class GudokPayloadError extends Error {}

export const PROVIDER = 'gudok'

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

export function toNumberDetails(p: GudokPayload) {
  return {
    number: p.dst.replace(/\D/g, '') || null,
    name: p.adv_channel_name || null,
  }
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
    source: 'webhook',
    raw: JSON.stringify(raw),
  }
}
