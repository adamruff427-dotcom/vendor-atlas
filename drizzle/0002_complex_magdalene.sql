CREATE TABLE `lead_events` (
	`id` text PRIMARY KEY NOT NULL,
	`enquiry_id` text NOT NULL,
	`created_at` text NOT NULL,
	`event` text NOT NULL,
	`service_id` text NOT NULL,
	`actor_type` text NOT NULL,
	`supplier_id` text,
	`amount_pence` integer,
	`currency` text,
	`payload` text NOT NULL,
	FOREIGN KEY (`enquiry_id`) REFERENCES `enquiries`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_lead_events_enquiry_created_at` ON `lead_events` (`enquiry_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_lead_events_event_created_at` ON `lead_events` (`event`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_lead_events_service_created_at` ON `lead_events` (`service_id`,`created_at`);
--> statement-breakpoint
PRAGMA optimize;
