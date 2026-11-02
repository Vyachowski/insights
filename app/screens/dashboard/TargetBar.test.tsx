import { MantineProvider } from '@mantine/core'
import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'

import TargetBar from './TargetBar'

afterEach(() => {
  vi.useRealTimers()
})

describe('TargetBar', () => {
  it('captions the target line with last year, whatever the year is', () => {
    vi.useFakeTimers({ toFake: ['Date'], now: new Date('2027-01-05T12:00:00Z') })

    const html = renderToString(
      <MantineProvider>
        <TargetBar current={1} previous={1} tooltip="" showYearLabel />
      </MantineProvider>,
    )

    expect(html).toContain('>2026<')
  })
})
