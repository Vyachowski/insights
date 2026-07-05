import { sql } from 'drizzle-orm'
import {
  date,
  doublePrecision,
  index,
  integer,
  numeric,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core'

export const roleEnum = pgEnum('Role', ['USER', 'ADMIN'])
export const userStatusEnum = pgEnum('UserStatus', ['ACTIVE', 'DEACTIVATED'])

const createdAt = timestamp('created_at', { precision: 3, mode: 'date' })
  .notNull()
  .defaultNow()
const updatedAt = timestamp('updated_at', { precision: 3, mode: 'date' })
  .notNull()
  .defaultNow()
  .$onUpdate(() => new Date())

export const users = pgTable(
  'users',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    role: roleEnum('role').notNull().default('USER'),
    firstName: text('first_name'),
    lastName: text('last_name'),
    status: userStatusEnum('status').notNull().default('ACTIVE'),
    createdAt,
    updatedAt,
  },
  table => [index('users_email_idx').on(table.email)],
)

export const cities = pgTable('cities', {
  id: serial('id').primaryKey(),
  code: text('code').notNull().unique(),
  slug: text('slug').notNull(),
  name: text('name').notNull(),
  population: integer('population').notNull(),
  createdAt,
  updatedAt,
})

export const sites = pgTable(
  'sites',
  {
    id: serial('id').primaryKey(),
    cityId: integer('city_id')
      .notNull()
      .references(() => cities.id, { onDelete: 'cascade' }),
    name: text('name'),
    group: text('group'),
    url: text('url').notNull(),
    yandexCounterId: text('yandex_counter_id').notNull(),
    googleCounterId: text('google_counter_id'),
    yandexTagManagerId: text('yandex_tag_manager_id'),
    googleTagManagerId: text('google_tag_manager_id'),
    createdAt,
    updatedAt,
  },
  table => [index('sites_city_id_idx').on(table.cityId)],
)

export const siteMetrics = pgTable(
  'site_metrics',
  {
    id: serial('id').primaryKey(),
    siteId: integer('site_id')
      .notNull()
      .references(() => sites.id, { onDelete: 'cascade' }),
    date: date('date', { mode: 'string' }).notNull(),
    yandexUsers: integer('yandex_users').notNull().default(0),
    googleUsers: integer('google_users').notNull().default(0),
    otherUsers: integer('other_users').notNull().default(0),
    visitDurationYandexInSec: doublePrecision('visit_duration_yandex_in_sec')
      .notNull()
      .default(0),
    visitDurationGoogleInSec: doublePrecision('visit_duration_google_in_sec')
      .notNull()
      .default(0),
    visitDurationOtherInSec: doublePrecision('visit_duration_other_in_sec')
      .notNull()
      .default(0),
    bounceYandex: doublePrecision('bounce_yandex').notNull().default(0),
    bounceGoogle: doublePrecision('bounce_google').notNull().default(0),
    bounceOther: doublePrecision('bounce_other').notNull().default(0),
    leadsYandex: integer('leads_yandex').notNull().default(0),
    leadsGoogle: integer('leads_google').notNull().default(0),
    leadsOther: integer('leads_other').notNull().default(0),
  },
  table => [
    uniqueIndex('site_metrics_site_id_date_key').on(table.siteId, table.date),
    index('site_metrics_date_idx').on(table.date),
  ],
)

export const callImports = pgTable(
  'call_imports',
  {
    id: serial('id').primaryKey(),
    siteId: integer('site_id')
      .notNull()
      .references(() => sites.id, { onDelete: 'cascade' }),
    date: timestamp('date', { precision: 3, mode: 'date' }).notNull(),
    src: text('src').notNull(),
    region: text('region'),
    callNumber: integer('call_number').notNull(),
    class: text('class'),
    projectTitle: text('project_title').notNull(),
    advChannelName: text('adv_channel_name').notNull(),
    billsec: integer('billsec').notNull(),
    comment: text('comment'),
    redirectNumber: text('redirect_number'),
    source: text('source').notNull().default('csv'),
    importedAt: timestamp('imported_at', { precision: 3, mode: 'date' })
      .notNull()
      .defaultNow(),
  },
  table => [
    index('call_imports_site_id_idx').on(table.siteId),
    uniqueIndex('call_imports_site_id_date_src_call_number_key').on(
      table.siteId,
      table.date,
      table.src,
      table.callNumber,
    ),
  ],
)

export const calls = pgTable(
  'calls',
  {
    id: serial('id').primaryKey(),
    siteId: integer('site_id')
      .notNull()
      .references(() => sites.id, { onDelete: 'cascade' }),
    gudokId: integer('gudok_id').notNull().unique(),
    projectId: integer('project_id').notNull(),
    projectTitle: text('project_title').notNull(),
    dst: text('dst').notNull(),
    advChannelId: text('adv_channel_id').notNull(),
    advChannelName: text('adv_channel_name').notNull(),
    src: text('src').notNull(),
    duration: integer('duration').notNull(),
    billsec: integer('billsec').notNull(),
    callstatus: text('callstatus').notNull(),
    date: timestamp('date', { precision: 3, mode: 'date' }).notNull(),
    region: text('region').notNull(),
    callNumber: integer('call_number').notNull(),
    audio: text('audio').notNull(),
    source: text('source').notNull().default('webhook'),
    createdAt,
    updatedAt,
  },
  table => [
    index('calls_site_id_idx').on(table.siteId),
    uniqueIndex('calls_site_id_date_src_key').on(
      table.siteId,
      table.date,
      table.src,
    ),
  ],
)

export const revenues = pgTable(
  'revenues',
  {
    id: serial('id').primaryKey(),
    siteId: integer('site_id').references(() => sites.id, {
      onDelete: 'cascade',
    }),
    date: date('date', { mode: 'string' }).notNull(),
    amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
    createdAt,
    updatedAt,
  },
  table => [
    index('revenues_date_idx').on(table.date),
    uniqueIndex('revenues_date_site_id_key').on(table.date, table.siteId),
    // Composite unique treats NULL site_id rows as distinct; this partial
    // index guards duplicate company-level rows (Prisma could not express it)
    uniqueIndex('revenue_date_null_site_idx')
      .on(table.date)
      .where(sql`${table.siteId} IS NULL`),
  ],
)

export const expenses = pgTable(
  'expenses',
  {
    id: serial('id').primaryKey(),
    siteId: integer('site_id').references(() => sites.id, {
      onDelete: 'cascade',
    }),
    date: date('date', { mode: 'string' }).notNull(),
    amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
    type: text('type').notNull(),
    comment: text('comment'),
    createdAt,
    updatedAt,
  },
  table => [
    index('expenses_date_idx').on(table.date),
    uniqueIndex('expenses_date_site_id_type_key').on(
      table.date,
      table.siteId,
      table.type,
    ),
    uniqueIndex('expenses_date_type_null_site_idx')
      .on(table.date, table.type)
      .where(sql`${table.siteId} IS NULL`),
  ],
)
