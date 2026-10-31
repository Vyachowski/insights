import { and, eq, isNotNull, sql } from 'drizzle-orm'

import { db } from '../client'
import { betweenInstants, type Period } from './period'
import { calls, cities, phoneNumbers, sites } from '../schema'

import type { Tx } from '../transaction'

type NewCall = typeof calls.$inferInsert

export function listCalls() {
  return db
    .select({
      id: calls.id,
      date: calls.date,
      src: calls.src,
      callNumber: calls.callNumber,
      source: calls.source,
      city: cities.name,
      channel: phoneNumbers.name,
    })
    .from(calls)
    .leftJoin(sites, eq(calls.siteId, sites.id))
    .leftJoin(cities, eq(sites.cityId, cities.id))
    .leftJoin(phoneNumbers, and(
      eq(calls.provider, phoneNumbers.provider),
      eq(calls.providerNumberId, phoneNumbers.providerNumberId),
    ))
    .orderBy(calls.id)
}

export async function findCallByProviderId(provider: string, providerCallId: string) {
  const [call] = await db
    .select({ siteId: calls.siteId })
    .from(calls)
    .where(and(eq(calls.provider, provider), eq(calls.providerCallId, providerCallId)))
  return call
}

/**
 * Store a webhook call. A CSV row holding the same call takes the webhook's
 * data, since the webhook is the authoritative source. Returns false when
 * another webhook call holds the key.
 */
export async function saveWebhookCall(row: NewCall): Promise<boolean> {
  const { siteId: _siteId, ...webhookFields } = row
  const written = await db
    .insert(calls)
    .values(row)
    .onConflictDoNothing({ target: [calls.provider, calls.providerCallId] })
    .onConflictDoUpdate({
      target: [calls.siteId, calls.src, calls.callNumber, calls.date],
      set: { ...webhookFields, updatedAt: new Date() },
      setWhere: sql`${calls.providerCallId} IS NULL`,
    })
    .returning({ id: calls.id })
  return written.length > 0
}

export async function saveCallWithoutSite(row: NewCall): Promise<boolean> {
  const kept = await db
    .insert(calls)
    .values({ ...row, siteId: null })
    .onConflictDoNothing({ target: [calls.provider, calls.providerCallId] })
    .returning({ id: calls.id })
  return kept.length > 0
}

export type CallListRow = Awaited<ReturnType<typeof listCalls>>[number]

interface CallKey {
  siteId: number
  src: string
  callNumber: number
}

export function findCallDates(tx: Tx, { siteId, src, callNumber }: CallKey) {
  return tx
    .select({ date: calls.date })
    .from(calls)
    .where(and(
      eq(calls.siteId, siteId),
      eq(calls.src, src),
      eq(calls.callNumber, callNumber),
    ))
    .all()
}

export function insertCall(tx: Tx, row: NewCall): void {
  tx.insert(calls).values(row).run()
}

// First calls (callNumber === 1) with a known site, deduplicated by `src`
// via COUNT(DISTINCT src): the call counting rule from docs/product-rules.md.
const isFirstCall = (period: Period) =>
  and(
    eq(calls.callNumber, 1),
    isNotNull(calls.siteId),
    betweenInstants(calls.date, period),
  )

export async function countFirstCalls(period: Period): Promise<number> {
  const [row] = await db
    .select({ total: sql<number>`count(distinct ${calls.src})` })
    .from(calls)
    .where(isFirstCall(period))
  return Number(row?.total ?? 0)
}

export async function countFirstCallsByCity(period: Period) {
  const rows = await db
    .select({
      cityId: cities.id,
      city: cities.name,
      count: sql<number>`count(distinct ${calls.src})`,
    })
    .from(calls)
    .innerJoin(sites, eq(calls.siteId, sites.id))
    .innerJoin(cities, eq(sites.cityId, cities.id))
    .where(isFirstCall(period))
    .groupBy(cities.id)
  return rows.map(r => ({ ...r, count: Number(r.count) }))
}
