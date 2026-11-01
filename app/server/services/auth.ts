import * as argon2 from 'argon2'

import { findUserByEmail, findUserById, type User } from '@/server/db/queries/users'

export type SessionUser = Omit<User, 'password'>

/** Verifies credentials; returns the user (without password) or null. */
export async function verifyLogin(
  email: string,
  password: string,
): Promise<SessionUser | null> {
  const user = await findUserByEmail(email)

  if (!user || user.status !== 'ACTIVE') return null
  if (!(await argon2.verify(user.password, password))) return null

  const { password: _password, ...sessionUser } = user
  return sessionUser
}

/** Returns the active user (without password) or null. */
export async function findActiveUser(userId: string): Promise<SessionUser | null> {
  const user = await findUserById(userId)
  if (!user || user.status !== 'ACTIVE') return null

  const { password: _password, ...sessionUser } = user
  return sessionUser
}
