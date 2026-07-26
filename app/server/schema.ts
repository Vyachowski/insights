import { sql } from 'drizzle-orm'
import {
  index,
  integer,
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

export const callImports = sqliteTable(
  'call_imports',
  {
    id: id(),
    siteId: integer('site_id')
      .notNull()
      .references(() => sites.id, { onDelete: 'cascade' }),
    date: integer('date', { mode: 'timestamp_ms' }).notNull(),
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
    importedAt: integer('imported_at', { mode: 'timestamp_ms' })
      .notNull()
      .$defaultFn(() => new Date()),
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

export const calls = sqliteTable(
  'calls',
  {
    id: id(),
    // Nullable: webhook calls whose project can't be matched to a site are
    // still stored (collect-all), with the full payload kept in `raw`
    siteId: integer('site_id').references(() => sites.id, {
      onDelete: 'cascade',
    }),
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
    date: integer('date', { mode: 'timestamp_ms' }).notNull(),
    region: text('region').notNull(),
    callNumber: integer('call_number').notNull(),
    audio: text('audio').notNull(),
    source: text('source').notNull().default('webhook'),
    // Full original Gudok webhook payload (JSON string) — nothing delivered
    // is lost even if a column mapping changes later
    raw: text('raw'),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
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
