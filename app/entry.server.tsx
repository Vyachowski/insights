import { PassThrough } from 'node:stream'

import { createReadableStreamFromReadable } from '@react-router/node'
import { isbot } from 'isbot'
import { renderToPipeableStream } from 'react-dom/server'
import { isRouteErrorResponse, ServerRouter } from 'react-router'

import type { RenderToPipeableStreamOptions } from 'react-dom/server'
import type { EntryContext } from 'react-router'

export const streamTimeout = 5_000

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
) {
  if (isHeadRequest(request)) {
    return new Response(null, { status: responseStatusCode, headers: responseHeaders })
  }

  return streamAppToResponse(request, responseStatusCode, responseHeaders, routerContext)
}

function isHeadRequest(request: Request) {
  return request.method.toUpperCase() === 'HEAD'
}

// Crawlers and SPA-mode renders need the full page in one shot; everyone
// else gets the shell as soon as it's ready.
function pickReadyEvent(
  request: Request,
  routerContext: EntryContext,
): keyof RenderToPipeableStreamOptions {
  const userAgent = request.headers.get('user-agent')
  const waitForFullPage = (userAgent && isbot(userAgent)) || routerContext.isSpaMode
  return waitForFullPage ? 'onAllReady' : 'onShellReady'
}

function toHtmlResponse(body: PassThrough, headers: Headers, status: number) {
  const stream = createReadableStreamFromReadable(body)
  headers.set('Content-Type', 'text/html')
  return new Response(stream, { headers, status })
}

function streamAppToResponse(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
) {
  return new Promise<Response>((resolve, reject) => {
    let shellRendered = false
    let timeoutId: ReturnType<typeof setTimeout> | undefined
      = setTimeout(() => abort(), streamTimeout + 1000)

    const { pipe, abort } = renderToPipeableStream(
      <ServerRouter context={routerContext} url={request.url} />,
      {
        [pickReadyEvent(request, routerContext)]() {
          shellRendered = true
          const body = new PassThrough({
            final(callback) {
              clearTimeout(timeoutId)
              timeoutId = undefined
              callback()
            },
          })
          pipe(body)
          resolve(toHtmlResponse(body, responseHeaders, responseStatusCode))
        },
        onShellError(error: unknown) {
          reject(error)
        },
        onError(error: unknown) {
          responseStatusCode = 500
          // Errors after the shell already resolved land here instead of
          // rejecting the promise above, so log them explicitly.
          if (shellRendered) {
            console.error(error)
          }
        },
      },
    )
  })
}

export function handleError(
  error: unknown,
  { request }: { request: Request },
) {
  if (request.signal.aborted) return
  if (isExpectedRouteNotFound(error)) return
  console.error(error)
}

// Bots probing dead paths (/.env, /favicon.ico, /wp-admin, ...) surface as
// 404 route errors — expected traffic, not a server failure.
function isExpectedRouteNotFound(error: unknown) {
  return isRouteErrorResponse(error) && error.status === 404
}
