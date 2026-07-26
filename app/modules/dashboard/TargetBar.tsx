import { Box, Progress, Text, Tooltip } from '@mantine/core'

import type { ReactNode } from 'react'

// The previous-year level sits at this fraction of the track; the current-year
// fill grows relative to it, so reaching the line means matching last year.
const TARGET_POSITION = 70

interface TargetBarProps {
  current: number
  previous: number
  // When true (expenses), staying below the line is good and passing it is bad.
  invert?: boolean
  tooltip: ReactNode
  // Show the «2025» caption above the target line (once per column is enough).
  showYearLabel?: boolean
}

export default function TargetBar({
  current,
  previous,
  invert = false,
  tooltip,
  showYearLabel = false,
}: TargetBarProps) {
  const ratio = previous > 0 ? current / previous : current > 0 ? 1.4 : 0
  const fill = Math.max(current > 0 ? 3 : 0, Math.min(100, ratio * TARGET_POSITION))
  const beats = invert ? current <= previous : current >= previous
  const color = beats ? 'teal' : 'red'

  return (
    <Box pos="relative" style={{ flex: 1 }}>
      {showYearLabel && (
        <Text
          size="9px"
          c="dimmed"
          style={{
            position: 'absolute',
            top: -13,
            left: `${TARGET_POSITION}%`,
            transform: 'translateX(-50%)',
          }}
        >
          2025
        </Text>
      )}
      <Tooltip label={tooltip} withArrow position="top" events={{ hover: true, focus: true, touch: true }}>
        <Progress value={fill} color={color} size="lg" radius="sm" />
      </Tooltip>
      <Box
        style={{
          position: 'absolute',
          top: -4,
          bottom: -4,
          left: `${TARGET_POSITION}%`,
          borderLeft: '1.5px dashed var(--mantine-color-dimmed)',
          pointerEvents: 'none',
        }}
      />
    </Box>
  )
}
