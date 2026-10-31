import { db } from './client'
import { cities } from './schema'

export type City = typeof cities.$inferSelect

export function listCities() {
  return db.select().from(cities).orderBy(cities.id)
}

export function countCities() {
  return db.$count(cities)
}

export async function insertCities(values: (typeof cities.$inferInsert)[]): Promise<number> {
  return (await db.insert(cities).values(values).returning()).length
}
