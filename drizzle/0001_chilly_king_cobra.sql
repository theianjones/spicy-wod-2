PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_workouts` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`scheme` text NOT NULL,
	`created_at` integer,
	`reps_per_round` integer,
	`rounds_to_score` integer DEFAULT 1,
	`time_cap` integer,
	`user_id` text,
	`sugar_id` text,
	`tiebreak_scheme` text,
	`secondary_scheme` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_workouts`("id", "name", "description", "scheme", "created_at", "reps_per_round", "rounds_to_score", "time_cap", "user_id", "sugar_id", "tiebreak_scheme", "secondary_scheme") SELECT "id", "name", "description", "scheme", "created_at", "reps_per_round", "rounds_to_score", "time_cap", "user_id", "sugar_id", "tiebreak_scheme", "secondary_scheme" FROM `workouts`;--> statement-breakpoint
DROP TABLE `workouts`;--> statement-breakpoint
ALTER TABLE `__new_workouts` RENAME TO `workouts`;--> statement-breakpoint
PRAGMA foreign_keys=ON;