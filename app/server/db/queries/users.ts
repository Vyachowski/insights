import { eq } from 'drizzle-orm'

import { db } from '../client'
import { users } from '../schema'

export type User = typeof users.$inferSelect

export async function findUserByEmail(email: string): Promise<User | undefined> {
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1)
  return user
}

export async function findUserById(id: string): Promise<User | undefined> {
  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1)
  return user
}

export function countUsers() {
  return db.$count(users)
}

export async function insertUsers(values: (typeof users.$inferInsert)[]): Promise<number> {
  return (await db.insert(users).values(values).returning()).length
}
