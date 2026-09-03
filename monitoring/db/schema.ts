import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const jobs = sqliteTable(
  'jobs',
  {
    id: text('id').primaryKey(),
    payload: text('payload').notNull(),
    dueAt: integer('due_at').notNull(),
    completedAt: integer('completed_at'),
    attempts: integer('attempts').notNull().default(0),
    error: text('error'),
  },
  (table) => [index('idx_jobs_due').on(table.completedAt, table.dueAt)],
);

export const sources = sqliteTable('sources', {
  url: text('url').primaryKey(),
  title: text('title').notNull(),
  hash: text('hash'),
  checkedAt: integer('checked_at'),
  error: text('error'),
  errorAt: integer('error_at'),
});

export const snapshots = sqliteTable('snapshots', {
  id: text('id').primaryKey(),
  url: text('url').notNull(),
  rawHash: text('raw_hash').notNull(),
  textHash: text('text_hash').notNull(),
  objectKey: text('object_key').notNull(),
  contentType: text('content_type').notNull(),
  size: integer('size').notNull(),
  fetchedAt: integer('fetched_at').notNull(),
});

export const events = sqliteTable(
  'events',
  {
    id: text('id').primaryKey(),
    kind: text('kind').notNull(),
    url: text('url').notNull(),
    title: text('title').notNull(),
    publicationDate: text('publication_date'),
    details: text('details').notNull(),
    oldSnapshot: text('old_snapshot'),
    newSnapshot: text('new_snapshot'),
    state: text('state').notNull().default('pending'),
    createdAt: integer('created_at').notNull(),
  },
  (table) => [
    index('idx_events_state_created').on(table.state, table.createdAt),
  ],
);

export const reviews = sqliteTable(
  'reviews',
  {
    id: text('id').primaryKey(),
    eventId: text('event_id')
      .notNull()
      .references(() => events.id),
    decision: text('decision').notNull(),
    note: text('note').notNull(),
    reviewer: text('reviewer').notNull(),
    createdAt: integer('created_at').notNull(),
  },
  (table) => [index('idx_reviews_event').on(table.eventId)],
);

export const meta = sqliteTable('meta', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
});

export const runs = sqliteTable('runs', {
  id: text('id').primaryKey(),
  startedAt: integer('started_at').notNull(),
  completedAt: integer('completed_at'),
  processed: integer('processed').notNull().default(0),
  failed: integer('failed').notNull().default(0),
});
