CREATE TABLE `monostructural_results` (
	`id` text PRIMARY KEY NOT NULL,
	`movement_id` text NOT NULL,
	`distance` integer NOT NULL,
	`time` integer NOT NULL,
	FOREIGN KEY (`id`) REFERENCES `results`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`movement_id`) REFERENCES `movements`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `monostructural_sets` (
	`id` text PRIMARY KEY NOT NULL,
	`result_id` text,
	`set_number` integer NOT NULL,
	`distance` integer NOT NULL,
	`time` integer NOT NULL,
	FOREIGN KEY (`result_id`) REFERENCES `monostructural_results`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `movements` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `results` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`date` integer NOT NULL,
	`type` text NOT NULL,
	`notes` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `strength_results` (
	`id` text PRIMARY KEY NOT NULL,
	`movement_id` text NOT NULL,
	`set_count` integer NOT NULL,
	FOREIGN KEY (`id`) REFERENCES `results`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`movement_id`) REFERENCES `movements`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `strength_sets` (
	`id` text PRIMARY KEY NOT NULL,
	`result_id` text,
	`set_number` integer NOT NULL,
	`reps` integer NOT NULL,
	`status` text NOT NULL,
	`weight` integer NOT NULL,
	FOREIGN KEY (`result_id`) REFERENCES `strength_results`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`joined_at` integer NOT NULL,
	`hashed_password` text NOT NULL,
	`password_salt` text NOT NULL,
	`password_reset_token` text,
	`password_reset_expires` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `wod_results` (
	`id` text PRIMARY KEY NOT NULL,
	`workout_id` text NOT NULL,
	`scale` text NOT NULL,
	FOREIGN KEY (`id`) REFERENCES `results`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`workout_id`) REFERENCES `workouts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `wod_sets` (
	`id` text PRIMARY KEY NOT NULL,
	`result_id` text,
	`score` integer,
	`set_number` integer NOT NULL,
	FOREIGN KEY (`result_id`) REFERENCES `wod_results`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `workout_movements` (
	`id` text PRIMARY KEY NOT NULL,
	`workout_id` text,
	`movement_id` text,
	FOREIGN KEY (`workout_id`) REFERENCES `workouts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`movement_id`) REFERENCES `movements`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `workouts` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`scheme` text NOT NULL,
	`created_at` integer,
	`reps_per_round` integer,
	`rounds_to_score` integer,
	`user_id` text,
	`sugar_id` text,
	`tiebreak_scheme` text,
	`secondary_scheme` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
