import { createTheme } from '@mantine/core'

// Default Mantine theme; only the app font is customised for now.
// Dark color scheme is applied via MantineProvider in main.tsx.
export const theme = createTheme({
  fontFamily: 'Manrope, -apple-system, BlinkMacSystemFont, sans-serif',
  fontFamilyMonospace: 'JetBrains Mono, monospace',
})
