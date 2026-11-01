import { createCookieSessionStorage, redirect } from 'react-router'

import { env, sessionMaxAgeSeconds } from '@/server/config'
import { findActiveUser, type SessionUser } from '@/server/services/auth'

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__session',
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: env.NODE_ENV === 'production',
    secrets: [env.JWT_SECRET],
    maxAge: sessionMaxAgeSeconds,
  },
})

/** Sets the session cookie and redirects. */
export async function createUserSession(
  userId: string,
  redirectTo: string,
): Promise<Response> {
  const session = await sessionStorage.getSession()
  session.set('userId', userId)
  return redirect(redirectTo, {
    headers: { 'Set-Cookie': await sessionStorage.commitSession(session) },
  })
}

export async function getUser(request: Request): Promise<SessionUser | null> {
  const session = await sessionStorage.getSession(
    request.headers.get('Cookie'),
  )
  const userId: unknown = session.get('userId')
  if (typeof userId !== 'string') return null

  return findActiveUser(userId)
}

/** Loader/action guard: redirects to /login when unauthenticated. */
export async function requireUser(request: Request): Promise<SessionUser> {
  const user = await getUser(request)
  if (!user) throw redirect('/login')
  return user
}

/** Loader/action guard: 403 for non-admins. */
export async function requireAdmin(request: Request): Promise<SessionUser> {
  const user = await requireUser(request)
  if (user.role !== 'ADMIN') {
    throw new Response('Forbidden', { status: 403 })
  }
  return user
}

/** Destroys the session and redirects to /login. */
export async function logout(request: Request): Promise<Response> {
  const session = await sessionStorage.getSession(
    request.headers.get('Cookie'),
  )
  return redirect('/login', {
    headers: { 'Set-Cookie': await sessionStorage.destroySession(session) },
  })
}
