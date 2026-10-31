import {
  type GudokPayload,
  GudokPayloadError,
  parseGudokPayload,
  PROVIDER,
  toCallRow,
  toNumberDetails,
} from '@/server/core/gudok-calls'
import { resolveProjectTitle } from '@/server/core/site-matching'
import { findCallByProviderId, saveCallWithoutSite, saveWebhookCall } from '@/server/db/queries/calls'
import { createPhoneNumber, findPhoneNumber, updatePhoneNumber } from '@/server/db/queries/phone-numbers'
import { findSiteIdByGudokProject, loadCityToSiteId } from '@/server/db/queries/sites'

export { GudokPayloadError }

async function resolveSiteId(p: GudokPayload): Promise<number | null> {
  const siteId = await findSiteIdByGudokProject(p.project_id)
  if (siteId !== null) return siteId
  const cityToSiteId = await loadCityToSiteId()
  return cityToSiteId.get(resolveProjectTitle(p.project_title)) ?? null
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

    const known = await findPhoneNumber(PROVIDER, p.adv_channel_id)
    siteId = known ? known.siteId : await resolveSiteId(p)

    const { number, name } = toNumberDetails(p)
    if (!known) {
      await createPhoneNumber({
        provider: PROVIDER,
        providerNumberId: p.adv_channel_id,
        number,
        siteId,
        name,
      })
    } else if ((number && number !== known.number) || (name && name !== known.name)) {
      await updatePhoneNumber(PROVIDER, p.adv_channel_id, {
        number: number ?? known.number,
        name: name ?? known.name,
      })
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`[gudok-webhook] number ${p.adv_channel_id} failed: ${message}`)
  }
  return siteId
}

/** Another webhook call on the same key can't be told apart, so this one is kept with a null site. */
async function storeCall(row: ReturnType<typeof toCallRow>) {
  if (await saveWebhookCall(row)) return { stored: true, siteId: row.siteId }

  console.error(`[gudok-webhook] call ${row.providerCallId} clashes with another call, stored without a site`)
  return { stored: await saveCallWithoutSite(row), siteId: null }
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
  const { payload: p, date } = parseGudokPayload(raw)

  // Checked first: a replayed old delivery must not touch the number either
  const seen = await findCallByProviderId(PROVIDER, String(p.id))
  if (seen) {
    return { stored: false, duplicate: true, gudokId: p.id, siteId: seen.siteId }
  }

  const siteId = await syncPhoneNumber(p)
  const call = await storeCall(toCallRow(p, date, siteId, raw))

  return { stored: call.stored, duplicate: !call.stored, gudokId: p.id, siteId: call.siteId }
}
