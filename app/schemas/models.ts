import { z } from 'zod';

// Base schemas for common fields
const baseIdSchema = z.object({
  id: z.string().uuid().optional(),
});

// Users schema
export const userSchema = baseIdSchema.extend({
  email: z.string().email(),
  joined_at: z.date({ coerce: true }),
  hashed_password: z.string(),
  password_salt: z.string(),
  password_reset_token: z.string().nullable(),
  password_reset_expires: z
    .date()
    .nullable()
    .transform(date => (date ? new Date(date) : null)),
});

// Movements schema
export const movementSchema = baseIdSchema.extend({
  name: z.string(),
  type: z.enum(['strength', 'gymnastic', 'monostructural']),
});

export const workoutSchemes = [
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
] as const;

// Workouts schema
export const workoutSchema = baseIdSchema.extend({
  name: z.string(),
  description: z.string(),
  scheme: z.enum(workoutSchemes),
  createdAt: z
    .date()
    .transform(date => new Date(date))
    .optional()
    .nullable(),
  repsPerRound: z.coerce.number().int().optional(),
  roundsToScore: z.coerce.number().int().optional(),
  timeCap: z.coerce.number().int().optional(),
  userId: z.string().uuid().optional(),
  sugarId: z.string().optional().nullable(),
  tiebreakScheme: z.enum(['time', 'reps']).nullish(),
  secondaryScheme: z
    .enum([
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
    ])
    .nullish(),
  movements: z.preprocess(
    value => (typeof value === 'string' ? value.split(',') : value),
    z.array(z.string()).optional()
  ),
});

// Workout Movements junction schema
export const workoutMovementSchema = baseIdSchema.extend({
  workoutId: z.string().uuid(),
  movementId: z.string().uuid(),
});

// Base Result schema
export const baseResultSchema = baseIdSchema.extend({
  userId: z.string(), // TODO: change to uuid, I'm spoofing id to 1 for now
  date: z.date({ coerce: true }),
  type: z.string(),
  notes: z.string().nullish(),
});

// WOD Results schema
export const wodResultSchema = baseIdSchema.extend({
  workoutId: z.string().uuid(),
  scale: z.enum(['rx', 'scaled', 'rx+']),
});

// WOD Sets schema
export const wodSetSchema = baseIdSchema.extend({
  score: z.number().int().optional(),
  setNumber: z.number().int(),
});

export const allWodResultSchema = baseResultSchema
  .merge(wodResultSchema)
  .extend({
    sets: z.array(wodSetSchema.omit({ id: true }))
  });

// Strength Results schema
export const strengthResultSchema = baseIdSchema.extend({
  movementId: z.string().uuid(),
  setCount: z.number().int(),
});

// Strength Sets schema
export const strengthSetSchema = baseIdSchema.extend({
  resultId: z.string().uuid(),
  setNumber: z.number().int(),
  reps: z.number().int(),
  status: z.enum(['pass', 'fail']),
  weight: z.number().int(),
});

// Monostructural Results schema
export const monostructuralResultSchema = baseIdSchema.extend({
  movementId: z.string().uuid(),
  distance: z.number().int(),
  time: z.number().int(),
});

// Monostructural Sets schema
export const monostructuralSetSchema = baseIdSchema.extend({
  resultId: z.string().uuid(),
  setNumber: z.number().int(),
  distance: z.number().int(),
  time: z.number().int(),
});

// Type inference helpers
export type User = z.infer<typeof userSchema>;
export type Movement = z.infer<typeof movementSchema>;
export type Workout = z.infer<typeof workoutSchema>;
export type WorkoutMovement = z.infer<typeof workoutMovementSchema>;
export type BaseResult = z.infer<typeof baseResultSchema>;
export type WodResult = z.infer<typeof wodResultSchema>;
export type WodSet = z.infer<typeof wodSetSchema>;
export type AllWodResult = z.infer<typeof allWodResultSchema>;
export type StrengthResult = z.infer<typeof strengthResultSchema>;
export type StrengthSet = z.infer<typeof strengthSetSchema>;
export type MonostructuralResult = z.infer<typeof monostructuralResultSchema>;
export type MonostructuralSet = z.infer<typeof monostructuralSetSchema>;
