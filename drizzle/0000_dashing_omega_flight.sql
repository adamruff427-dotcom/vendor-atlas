CREATE TABLE `enquiries` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text NOT NULL,
	`service_id` text NOT NULL,
	`company_name` text NOT NULL,
	`contact_name` text NOT NULL,
	`business_email` text NOT NULL,
	`phone` text,
	`consent` integer NOT NULL,
	`payload` text NOT NULL,
	`status` text DEFAULT 'received' NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_enquiries_created_at` ON `enquiries` (`created_at`);--> statement-breakpoint
CREATE INDEX `idx_enquiries_status` ON `enquiries` (`status`);
--> statement-breakpoint
PRAGMA optimize;
