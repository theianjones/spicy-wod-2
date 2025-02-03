import { z } from "zod";

// Base schemas for common fields
const baseIdSchema = z.object({
  id: z.string().uuid(),
});

// Users schema
export const userSchema = baseIdSchema.extend({
  email: z.string().email(),
  joined_at: z.date({coerce: true}),
  hashed_password: z.string(),
  password_salt: z.string(),
  password_reset_token: z.string().nullable(),
  password_reset_expires: z.date().nullable().transform((date) => date ? new Date(date) : null),
});

// Movements schema
export const movementSchema = baseIdSchema.extend({
  name: z.string(),
  type: z.enum(["strength", "gymnastic", "monostructural"]),
});

// Workouts schema
export const workoutSchema = baseIdSchema.extend({
  name: z.string(),
  description: z.string(),
  scheme: z.enum([
    "time",
    "time-with-cap",
    "pass-fail",
    "rounds-reps",
    "reps",
    "emom",
    "load",
    "calories",
    "meters",
    "feet",
    "points",
  ]),
  createdAt: z.number().int().optional(),
  repsPerRound: z.coerce.number().int().optional(),
  roundsToScore: z.coerce.number().int().optional(),
  userId: z.string().uuid().optional(),
  sugarId: z.string().optional(),
  tiebreakScheme: z.enum(["time", "reps"]).nullish(),
  secondaryScheme: z.enum([
    "time",
    "pass-fail",
    "rounds-reps",
    "reps",
    "emom",
    "load",
    "calories",
    "meters",
    "feet",
    "points",
  ]).nullish(),
  movements: z.array(z.string()).optional(),
});

// Workout Movements junction schema
export const workoutMovementSchema = baseIdSchema.extend({
  workoutId: z.string().uuid(),
  movementId: z.string().uuid(),
});

// Base Result schema
export const baseResultSchema = baseIdSchema.extend({
  userId: z.string().uuid(),
  date: z.number().int(),
  type: z.string(),
  notes: z.string().optional(),
});

// WOD Results schema
export const wodResultSchema = baseIdSchema.extend({
  workoutId: z.string().uuid(),
  scale: z.enum(["rx", "scaled", "rx+"]),
});

// WOD Sets schema
export const wodSetSchema = baseIdSchema.extend({
  resultId: z.string().uuid(),
  score: z.number().int().optional(),
  setNumber: z.number().int(),
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
  status: z.enum(["pass", "fail"]),
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
export type StrengthResult = z.infer<typeof strengthResultSchema>;
export type StrengthSet = z.infer<typeof strengthSetSchema>;
export type MonostructuralResult = z.infer<typeof monostructuralResultSchema>;
export type MonostructuralSet = z.infer<typeof monostructuralSetSchema>; 