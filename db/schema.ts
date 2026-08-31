import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const enquiries = sqliteTable('enquiries', {
  id: text('id').primaryKey(),
  createdAt: text('created_at').notNull(),
  serviceId: text('service_id').notNull(),
  companyName: text('company_name').notNull(),
  contactName: text('contact_name').notNull(),
  businessEmail: text('business_email').notNull(),
  phone: text('phone'),
  consent: integer('consent', { mode: 'boolean' }).notNull(),
  payload: text('payload').notNull(),
  status: text('status').notNull().default('received'),
}, (table) => [index('idx_enquiries_created_at').on(table.createdAt), index('idx_enquiries_status').on(table.status)])

export const analyticsEvents = sqliteTable('analytics_events', {
  id: text('id').primaryKey(),
  createdAt: text('created_at').notNull(),
  event: text('event').notNull(),
  path: text('path').notNull(),
  payload: text('payload').notNull(),
}, (table) => [
  index('idx_analytics_events_created_at').on(table.createdAt),
  index('idx_analytics_events_event_created_at').on(table.event, table.createdAt),
])
