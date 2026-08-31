CREATE TABLE `analytics_events` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text NOT NULL,
	`event` text NOT NULL,
	`path` text NOT NULL,
	`payload` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_analytics_events_created_at` ON `analytics_events` (`created_at`);--> statement-breakpoint
CREATE INDEX `idx_analytics_events_event_created_at` ON `analytics_events` (`event`,`created_at`);