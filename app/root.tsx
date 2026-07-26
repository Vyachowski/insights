import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'

import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
} from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from 'react-router'

import { theme } from '@/theme'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Insights</title>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <ColorSchemeScript defaultColorScheme="dark" />
        <Meta />
        <Links />
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="dark">
          <Notifications />
          {children}
        </MantineProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}

export function ErrorBoundary() {
  const error = useRouteError()
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : 'Unknown error'

  return (
    <div style={{ padding: 32, fontFamily: 'monospace' }}>
      <h1>Something went wrong</h1>
      <p>{message}</p>
    </div>
  )
}
