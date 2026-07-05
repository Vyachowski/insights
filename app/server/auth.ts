import * as argon2 from 'argon2'
import { eq } from 'drizzle-orm'
import { createCookieSessionStorage, redirect } from 'react-router'

import { db } from './db'
import { env, sessionMaxAgeSeconds } from './env'
import { users } from './schema'

export type SessionUser = Omit<typeof users.$inferSelect, 'password'>

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

/** Verifies credentials; returns the user (without password) or null. */
export async function verifyLogin(
  email: string,
  password: string,
): Promise<SessionUser | null> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1)

  if (!user || user.status !== 'ACTIVE') return null
  if (!(await argon2.verify(user.password, password))) return null

  const { password: _password, ...sessionUser } = user
  return sessionUser
}

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

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)
  if (!user || user.status !== 'ACTIVE') return null

  const { password: _password, ...sessionUser } = user
  return sessionUser
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
