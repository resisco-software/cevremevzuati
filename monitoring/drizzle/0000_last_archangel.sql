CREATE TABLE `events` (
	`id` text PRIMARY KEY NOT NULL,
	`kind` text NOT NULL,
	`url` text NOT NULL,
	`title` text NOT NULL,
	`publication_date` text,
	`details` text NOT NULL,
	`old_snapshot` text,
	`new_snapshot` text,
	`state` text DEFAULT 'pending' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_events_state_created` ON `events` (`state`,`created_at`);--> statement-breakpoint
CREATE TABLE `jobs` (
	`id` text PRIMARY KEY NOT NULL,
	`payload` text NOT NULL,
	`due_at` integer NOT NULL,
	`completed_at` integer,
	`attempts` integer DEFAULT 0 NOT NULL,
	`error` text
);
--> statement-breakpoint
CREATE INDEX `idx_jobs_due` ON `jobs` (`completed_at`,`due_at`);--> statement-breakpoint
CREATE TABLE `meta` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`decision` text NOT NULL,
	`note` text NOT NULL,
	`reviewer` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `runs` (
	`id` text PRIMARY KEY NOT NULL,
	`started_at` integer NOT NULL,
	`completed_at` integer,
	`processed` integer DEFAULT 0 NOT NULL,
	`failed` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `snapshots` (
	`id` text PRIMARY KEY NOT NULL,
	`url` text NOT NULL,
	`raw_hash` text NOT NULL,
	`text_hash` text NOT NULL,
	`object_key` text NOT NULL,
	`content_type` text NOT NULL,
	`size` integer NOT NULL,
	`fetched_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sources` (
	`url` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`hash` text,
	`checked_at` integer,
	`error` text,
	`error_at` integer
);
