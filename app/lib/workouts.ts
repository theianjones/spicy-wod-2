import { workoutSchema } from "~/schemas/models";
import type { Route } from "../+types/root";
import { z } from "zod";

export const workoutFiltersSchema = z.object({
  name: z.string().optional().nullable(),
  scheme: z.string().optional().nullable(),
  movements: z.array(z.string()).optional().nullable()
}).default({});

export type WorkoutFilters = z.infer<typeof workoutFiltersSchema>;

export async function getAllWorkoutsWithMovements({ 
  context,
  filters = {}
}: { 
  context: Route.LoaderArgs["context"],
  filters?: WorkoutFilters
}) {
  const db = context.cloudflare.env.DB;
  
  let query = `
    SELECT 
      w.*,
      GROUP_CONCAT(m.id) as movement_ids,
      GROUP_CONCAT(m.name) as movement_names,
      GROUP_CONCAT(m.type) as movement_types
    FROM workouts w
    LEFT JOIN workout_movements wm ON w.id = wm.workout_id
    LEFT JOIN movements m ON wm.movement_id = m.id
  `;

  const conditions: string[] = [];
  const params: any[] = [];

  if (filters.name) {
    conditions.push("LOWER(w.name) LIKE ?");
    params.push(`%${filters.name.toLowerCase()}%`);
  }

  if (filters.scheme && filters.scheme !== "all") {
    conditions.push("w.scheme = ?");
    params.push(filters.scheme);
  }

  if (filters.movements && filters.movements.length > 0) {
    const movementPlaceholders = filters.movements.map(() => "?").join(",");
    conditions.push(`w.id IN (
      SELECT workout_id 
      FROM workout_movements wm2 
      JOIN movements m2 ON wm2.movement_id = m2.id 
      WHERE m2.id IN (${movementPlaceholders})
      GROUP BY workout_id 
      HAVING COUNT(DISTINCT m2.id) = ?
    )`);
    params.push(...filters.movements, filters.movements.length);
  }

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(" AND ")}`;
  }

  query += " GROUP BY w.id";

  const result = await db.prepare(query).bind(...params).all();

  const workouts = result.results.map((workout) => {
    return workoutSchema.transform((data) => ({
      ...data,
      movements: workout.movement_names ?
        (workout.movement_names as string).split(',').map(movement => movement.trim())
        : []
    })).parse(workout)
  });

  return {
    workouts
  }
}


export async function getWorkoutWithMovementsByIdOrName(idOrName: string, context: Route.LoaderArgs["context"]) {

  const db = context.cloudflare.env.DB
  const result = await db.prepare(`
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
    `).bind(idOrName, idOrName).first()

  return workoutSchema.transform((data) => ({
    ...data,
    movements: result?.movement_names ?
      (result.movement_names as string).split(',').map(movement => movement.trim())
      : []
  })).parse(result)
}
