import { writeDueEstimates } from '../services/auto-charges'

const HOUR_MS = 60 * 60 * 1000

let timer: NodeJS.Timeout | null = null

export function startAutoChargeScheduler(): void {
  runCheck()
  timer = setInterval(runCheck, HOUR_MS)
}

/** Clear the hourly timer so no new check starts. Idempotent; safe before start. */
export function stopAutoChargeScheduler(): void {
  if (timer) clearInterval(timer)
  timer = null
}

// A check is synchronous, so a shutdown can never find one mid-flight
function runCheck(): void {
  try {
    const { checked, written } = writeDueEstimates()
    console.log(`[auto-charges] schedules checked: ${checked}, estimates written: ${written}`)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`[auto-charges] check failed: ${message} (retrying next tick)`)
  }
}
