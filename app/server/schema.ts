import { sql } from 'drizzle-orm'
import {
  index,
  integer,
  primaryKey,
  real,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core'

const id = () => integer('id').primaryKey({ autoIncrement: true })
const createdAt = () => integer('created_at', { mode: 'timestamp_ms' })
  .notNull()
  .$defaultFn(() => new Date())
const updatedAt = () => integer('updated_at', { mode: 'timestamp_ms' })
  .notNull()
  .$defaultFn(() => new Date())
  .$onUpdate(() => new Date())

export const users = sqliteTable(
  'users',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    role: text('role', { enum: ['USER', 'ADMIN'] }).notNull().default('USER'),
    firstName: text('first_name'),
    lastName: text('last_name'),
    status: text('status', { enum: ['ACTIVE', 'DEACTIVATED'] })
      .notNull()
      .default('ACTIVE'),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  table => [index('users_email_idx').on(table.email)],
)

export const cities = sqliteTable('cities', {
  id: id(),
  code: text('code').notNull().unique(),
  slug: text('slug').notNull(),
  name: text('name').notNull(),
  population: integer('population').notNull(),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
})

export const sites = sqliteTable(
  'sites',
  {
    id: id(),
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
    gudokProjectId: integer('gudok_project_id'),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  table => [index('sites_city_id_idx').on(table.cityId)],
)

export const siteMetrics = sqliteTable(
  'site_metrics',
  {
    id: id(),
    siteId: integer('site_id')
      .notNull()
      .references(() => sites.id, { onDelete: 'cascade' }),
    date: text('date').notNull(),
    yandexUsers: integer('yandex_users').notNull().default(0),
    googleUsers: integer('google_users').notNull().default(0),
    otherUsers: integer('other_users').notNull().default(0),
    visitDurationYandexInSec: real('visit_duration_yandex_in_sec')
      .notNull()
      .default(0),
    visitDurationGoogleInSec: real('visit_duration_google_in_sec')
      .notNull()
      .default(0),
    visitDurationOtherInSec: real('visit_duration_other_in_sec')
      .notNull()
      .default(0),
    bounceYandex: real('bounce_yandex').notNull().default(0),
    bounceGoogle: real('bounce_google').notNull().default(0),
    bounceOther: real('bounce_other').notNull().default(0),
    leadsYandex: integer('leads_yandex').notNull().default(0),
    leadsGoogle: integer('leads_google').notNull().default(0),
    leadsOther: integer('leads_other').notNull().default(0),
  },
  table => [
    uniqueIndex('site_metrics_site_id_date_key').on(table.siteId, table.date),
    index('site_metrics_date_idx').on(table.date),
  ],
)

export const phoneNumbers = sqliteTable(
  'phone_numbers',
  {
    provider: text('provider').notNull(),
    // For Gudok this is `adv_channel_id`; removed channels use a temporary `csv:` ID
    providerNumberId: text('provider_number_id').notNull(),
    number: text('number').unique(),
    siteId: integer('site_id').references(() => sites.id, {
      onDelete: 'cascade',
    }),
    name: text('name'),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  table => [
    primaryKey({ columns: [table.provider, table.providerNumberId] }),
    index('phone_numbers_site_id_idx').on(table.siteId),
  ],
)

export const calls = sqliteTable(
  'calls',
  {
    id: id(),
    // Nullable: a call whose site can't be resolved is still stored
    siteId: integer('site_id').references(() => sites.id, {
      onDelete: 'cascade',
    }),
    provider: text('provider').notNull(),
    // No foreign key to phone_numbers: a number failure must not reject a call
    providerNumberId: text('provider_number_id'),
    providerCallId: text('provider_call_id'),
    src: text('src').notNull(),
    callNumber: integer('call_number').notNull(),
    date: integer('date', { mode: 'timestamp_ms' }).notNull(),
    callstatus: text('callstatus'),
    billsec: integer('billsec'),
    region: text('region'),
    source: text('source').notNull(),
    // Full source record (JSON string): webhook payload or CSV row
    raw: text('raw').notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  table => [
    index('calls_site_id_idx').on(table.siteId),
    uniqueIndex('calls_provider_provider_call_id_key').on(
      table.provider,
      table.providerCallId,
    ),
    uniqueIndex('calls_site_id_src_call_number_date_key').on(
      table.siteId,
      table.src,
      table.callNumber,
      table.date,
    ),
  ],
)

// Money amounts are integer kopecks; converted to rubles at the query boundary
export const revenues = sqliteTable(
  'revenues',
  {
    id: id(),
    siteId: integer('site_id').references(() => sites.id, {
      onDelete: 'cascade',
    }),
    date: text('date').notNull(),
    amount: integer('amount').notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  table => [
    index('revenues_date_idx').on(table.date),
    uniqueIndex('revenues_date_site_id_key').on(table.date, table.siteId),
    // Composite unique treats NULL site_id rows as distinct; this partial
    // index guards duplicate company-level rows
    uniqueIndex('revenue_date_null_site_idx')
      .on(table.date)
      .where(sql`site_id IS NULL`),
  ],
)

export const expenses = sqliteTable(
  'expenses',
  {
    id: id(),
    siteId: integer('site_id').references(() => sites.id, {
      onDelete: 'cascade',
    }),
    date: text('date').notNull(),
    amount: integer('amount').notNull(),
    type: text('type').notNull(),
    comment: text('comment'),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
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
      .where(sql`site_id IS NULL`),
  ],
)
