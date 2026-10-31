import {
  compareWithStored,
  groupNumbersByName,
  parseCallRow,
  REASON,
  REASON_COLUMN,
  resolveNumber,
  toDisputedCsv,
} from '@/server/core/calls-csv'
import { assertCsvColumns, assertSkipRate, type CsvRow, parseCsvBuffer } from '@/server/core/csv'
import { PROVIDER } from '@/server/core/gudok-calls'
import { findCallDates, insertCall } from '@/server/db/calls'
import { listPhoneNumbers } from '@/server/db/phone-numbers'
import { transaction } from '@/server/db/transaction'

export interface CallsImportResult {
  created: number
  skipped: number
  disputed: number
  disputedCsv: string | null
}

const CHUNK_SIZE = 1000

/**
 * Fill gaps from a Gudok export. Rows with no stored call on the key are
 * written, rows matching on key and minute are skipped, and all others are
 * handed back unwritten. Stored rows are never changed.
 */
export async function importCallsCsv(buffer: Buffer): Promise<CallsImportResult> {
  const rows = parseCsvBuffer(buffer)
  assertCsvColumns(rows, ['Дата', 'Кто звонил', '№', 'Куда звонил'])

  const parsed = rows.map(row => ({ row, call: parseCallRow(row) }))
  const invalid = parsed.filter(({ call }) => !call).length
  // Before any write: a rejected file must leave the table as it was
  assertSkipRate(rows.length - invalid, invalid)

  const numbersByName = groupNumbersByName(await listPhoneNumbers(PROVIDER))
  const disputed: CsvRow[] = []
  let created = 0
  let skipped = 0

  for (let i = 0; i < parsed.length; i += CHUNK_SIZE) {
    // Sync driver: yield the event loop between chunks so concurrent
    // requests are served during large imports
    if (i > 0) await new Promise(resolve => setImmediate(resolve))

    // One transaction per chunk: a webhook can't land between a check and its
    // write, and earlier rows of the file count as stored for later ones
    transaction(tx => {
      for (const { row, call } of parsed.slice(i, i + CHUNK_SIZE)) {
        if (!call) {
          disputed.push({ ...row, [REASON_COLUMN]: REASON.invalid })
          continue
        }

        const number = resolveNumber(numbersByName.get(row['Куда звонил']))
        if (number.problem) {
          disputed.push({ ...row, [REASON_COLUMN]: number.problem })
          continue
        }
        const { providerNumberId, siteId } = number

        const match = compareWithStored(call.date, findCallDates(tx, { ...call, siteId }))
        if (match === 'duplicate') {
          skipped++
        } else if (match === 'otherMinute') {
          disputed.push({ ...row, [REASON_COLUMN]: REASON.otherMinute })
        } else {
          insertCall(tx, {
            ...call,
            siteId,
            provider: PROVIDER,
            providerNumberId,
            source: 'csv',
            raw: JSON.stringify(row),
          })
          created++
        }
      }
    })
  }

  return {
    created,
    skipped,
    disputed: disputed.length,
    disputedCsv: disputed.length > 0 ? toDisputedCsv(disputed) : null,
  }
}
