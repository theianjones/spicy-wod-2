import { and, eq, inArray, like, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import { z } from 'zod';

import { workoutSchema } from '~/schemas/models';
import * as schema from '../../db/schema';
import type { Route } from '../+types/root';

export const workoutFiltersSchema = z
  .object({
    name: z.string().optional().nullable(),
    scheme: z.string().optional().nullable(),
    movements: z.array(z.string()).optional().nullable(),
  })
  .default({});

export type WorkoutFilters = z.infer<typeof workoutFiltersSchema>;

export async function getAllWorkoutsWithMovements({
  context,
  filters = {},
}: {
  context: Route.LoaderArgs['context'];
  filters?: WorkoutFilters;
}) {
  const db = drizzle(context.cloudflare.env.DB, { schema });

  const baseQuery = db
    .select({
      id: schema.workouts.id,
      name: schema.workouts.name,
      description: schema.workouts.description,
      scheme: schema.workouts.scheme,
      repsPerRound: schema.workouts.repsPerRound,
      roundsToScore: schema.workouts.roundsToScore,
      tiebreakScheme: schema.workouts.tiebreakScheme,
      secondaryScheme: schema.workouts.secondaryScheme,
      movement_ids: sql<string>`GROUP_CONCAT(${schema.movements.id})`,
      movement_names: sql<string>`GROUP_CONCAT(${schema.movements.name})`,
      movement_types: sql<string>`GROUP_CONCAT(${schema.movements.type})`,
    })
    .from(schema.workouts)
    .leftJoin(schema.workoutMovements, eq(schema.workouts.id, schema.workoutMovements.workoutId))
    .leftJoin(schema.movements, eq(schema.workoutMovements.movementId, schema.movements.id));

  const conditions = [];

  if (filters.name) {
    conditions.push(like(sql`LOWER(${schema.workouts.name})`, `%${filters.name.toLowerCase()}%`));
  }

  if (filters.scheme && filters.scheme !== 'all') {
    conditions.push(eq(schema.workouts.scheme, filters.scheme as any));
  }

  if (filters.movements && filters.movements.length > 0) {
    const movementSubquery = db
      .select({ workoutId: schema.workoutMovements.workoutId })
      .from(schema.workoutMovements)
      .where(inArray(schema.workoutMovements.movementId, filters.movements))
      .groupBy(schema.workoutMovements.workoutId)
      .having(
        sql`COUNT(DISTINCT ${schema.workoutMovements.movementId}) = ${filters.movements.length}`
      );

    conditions.push(inArray(schema.workouts.id, movementSubquery));
  }

  const query = conditions.length > 0 ? baseQuery.where(and(...conditions)) : baseQuery;

  const finalQuery = query.groupBy(schema.workouts.id);
  const result = await finalQuery;

  const workouts = result.map(workout => {
    return workoutSchema
      .transform(data => ({
        ...data,
        movements: workout.movement_names
          ? String(workout.movement_names)
              .split(',')
              .map(movement => movement.trim())
          : [],
      }))
      .parse(workout);
  });

  return {
    workouts,
  };
}

export async function getWorkoutWithMovementsByIdOrName(
  idOrName: string,
  context: Route.LoaderArgs['context']
) {
  const db = context.cloudflare.env.DB;
  const result = await db
    .prepare(
      `
      SELECT 
        w.*,
        GROUP_CONCAT(m.id) as movement_ids,
        GROUP_CONCAT(m.name) as movement_names,
        GROUP_CONCAT(m.type) as movement_types
      FROM workouts w
      LEFT JOIN workout_movements wm ON w.id = wm.workout_id
      LEFT JOIN movements m ON wm.movement_id = m.id
      WHERE w.id = ? OR LOWER(w.name) = LOWER(?)
      GROUP BY w.id
    `
    )
    .bind(idOrName, idOrName)
    .first();

  return workoutSchema
    .transform(data => ({
      ...data,
      movements: result?.movement_names
        ? (result.movement_names as string).split(',').map(movement => movement.trim())
        : [],
    }))
    .parse(result);
}
