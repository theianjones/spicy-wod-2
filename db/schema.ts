import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// Users table
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  joinedAt: integer('joined_at', { mode: 'timestamp' }).notNull(),
  hashedPassword: text('hashed_password').notNull(),
  passwordSalt: text('password_salt').notNull(),
  passwordResetToken: text('password_reset_token'),
  passwordResetExpires: integer('password_reset_expires', { mode: 'timestamp' }),
});

// Movements table
export const movements = sqliteTable('movements', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type', {
    enum: ['strength', 'gymnastic', 'monostructural'],
  }).notNull(),
});

// Workouts table
export const workouts = sqliteTable('workouts', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  scheme: text('scheme', {
    enum: [
      'time',
      'time-with-cap',
      'pass-fail',
      'rounds-reps',
      'reps',
      'emom',
      'load',
      'calories',
      'meters',
      'feet',
      'points',
    ],
  }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }),
  repsPerRound: integer('reps_per_round'),
  roundsToScore: integer('rounds_to_score').default(1),
  userId: text('user_id').references(() => users.id),
  sugarId: text('sugar_id'),
  tiebreakScheme: text('tiebreak_scheme', { enum: ['time', 'reps'] }),
  secondaryScheme: text('secondary_scheme', {
    enum: [
      'time',
      'pass-fail',
      'rounds-reps',
      'reps',
      'emom',
      'load',
      'calories',
      'meters',
      'feet',
      'points',
    ],
  }),
});

// Workout Movements junction table
export const workoutMovements = sqliteTable('workout_movements', {
  id: text('id').primaryKey(),
  workoutId: text('workout_id').references(() => workouts.id),
  movementId: text('movement_id').references(() => movements.id),
});

// Results base table
export const results = sqliteTable('results', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .references(() => users.id)
    .notNull(),
  date: integer('date', { mode: 'timestamp' }).notNull(),
  type: text('type').notNull(),
  notes: text('notes'),
});

// WOD Results
export const wodResults = sqliteTable('wod_results', {
  id: text('id')
    .references(() => results.id)
    .primaryKey(),
  workoutId: text('workout_id')
    .references(() => workouts.id)
    .notNull(),
  scale: text('scale', { enum: ['rx', 'scaled', 'rx+'] }).notNull(),
});

// WOD Sets
export const wodSets = sqliteTable('wod_sets', {
  id: text('id').primaryKey(),
  resultId: text('result_id').references(() => wodResults.id),
  score: integer('score'),
  setNumber: integer('set_number').notNull(),
});

// Strength Results
export const strengthResults = sqliteTable('strength_results', {
  id: text('id')
    .references(() => results.id)
    .primaryKey(),
  movementId: text('movement_id')
    .references(() => movements.id)
    .notNull(),
  setCount: integer('set_count').notNull(),
});

// Strength Sets
export const strengthSets = sqliteTable('strength_sets', {
  id: text('id').primaryKey(),
  resultId: text('result_id').references(() => strengthResults.id),
  setNumber: integer('set_number').notNull(),
  reps: integer('reps').notNull(),
  status: text('status', { enum: ['pass', 'fail'] }).notNull(),
  weight: integer('weight').notNull(),
});

// Monostructural Results
export const monostructuralResults = sqliteTable('monostructural_results', {
  id: text('id')
    .references(() => results.id)
    .primaryKey(),
  movementId: text('movement_id')
    .references(() => movements.id)
    .notNull(),
  distance: integer('distance').notNull(),
  time: integer('time').notNull(),
});

// Monostructural Sets
export const monostructuralSets = sqliteTable('monostructural_sets', {
  id: text('id').primaryKey(),
  resultId: text('result_id').references(() => monostructuralResults.id),
  setNumber: integer('set_number').notNull(),
  distance: integer('distance').notNull(),
  time: integer('time').notNull(),
});
