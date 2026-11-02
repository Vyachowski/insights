import { MantineProvider } from '@mantine/core'
import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'

import MonthlyProfitWidget from './MonthlyProfitWidget'

afterEach(() => {
  vi.useRealTimers()
})

describe('MonthlyProfitWidget', () => {
  it('takes both years from the current date, not from the module load', () => {
    vi.useFakeTimers({ toFake: ['Date'], now: new Date('2030-01-05T12:00:00Z') })

    const html = renderToString(
      <MantineProvider>
        <MonthlyProfitWidget monthly={{ months: [], averageCurrent: 0, averagePrevious: 0, elapsedMonths: 1 }} />
      </MantineProvider>,
    )

    expect(html).toMatch(/2030\D+текущий/)
    expect(html).toMatch(/2029\D+прошлый/)
  })

  it('offers the shared toggle and starts in percent', () => {
    const html = renderToString(
      <MantineProvider>
        <MonthlyProfitWidget monthly={{ months: [], averageCurrent: 1200, averagePrevious: 1000, elapsedMonths: 1 }} />
      </MantineProvider>,
    )

    expect(html).toContain('абс.')
    expect(html).toContain('+20%')
  })
})
